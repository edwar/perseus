import { prisma } from "@/lib/db"

interface CategorySuggestion {
  category: string
  confidence: number
}

export async function classifyTransaction(
  userId: string,
  description: string
): Promise<CategorySuggestion[]> {
  return matchByPatterns(userId, description)
}

async function matchByPatterns(userId: string, description: string): Promise<CategorySuggestion[]> {
  const normalized = description.toLowerCase().trim()
  const words = normalized.split(/\s+/)

  const patterns = await prisma.appCategoryPattern.findMany({
    where: { userId },
    orderBy: { count: "desc" },
  })

  const matches: CategorySuggestion[] = []

  for (const pattern of patterns) {
    const patternLower = pattern.pattern.toLowerCase()

    if (normalized.includes(patternLower) || patternLower.includes(normalized)) {
      matches.push({
        category: pattern.category,
        confidence: pattern.confidence,
      })
    } else {
      for (const word of words) {
        if (word.length > 3 && patternLower.includes(word)) {
          matches.push({
            category: pattern.category,
            confidence: pattern.confidence * 0.7,
          })
          break
        }
      }
    }
  }

  const unique = new Map<string, CategorySuggestion>()
  for (const match of matches) {
    const existing = unique.get(match.category)
    if (!existing || match.confidence > existing.confidence) {
      unique.set(match.category, match)
    }
  }

  return Array.from(unique.values())
}

export async function learnFromTransaction(
  userId: string,
  description: string,
  category: string
): Promise<void> {
  if (!category) return

  const normalized = description.toLowerCase().trim()
  const keywords = extractKeywords(normalized)

  for (const keyword of keywords) {
    try {
      const existing = await prisma.appCategoryPattern.findUnique({
        where: {
          userId_pattern_category: {
            userId,
            pattern: keyword,
            category,
          },
        },
      })

      if (existing) {
        await prisma.appCategoryPattern.update({
          where: { id: existing.id },
          data: {
            count: existing.count + 1,
            confidence: Math.min(1, existing.confidence + 0.05),
          },
        })
      } else {
        await prisma.appCategoryPattern.create({
          data: {
            userId,
            pattern: keyword,
            category,
            confidence: 0.4,
            count: 1,
          },
        })
      }
    } catch {
      // ignore duplicates
    }
  }
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "el", "la", "los", "las", "un", "una", "de", "del", "en", "con", "por", "para",
    "que", "se", "su", "al", "lo", "como", "más", "pero", "sus", "le", "ya", "o",
    "este", "si", "porque", "esta", "entre", "cuando", "muy", "sin", "sobre",
    "también", "me", "hasta", "hay", "donde", "quien", "desde", "todo", "nos",
    "durante", "todos", "uno", "les", "ni", "contra", "otros", "fue", "ese",
    "eso", "ante", "ellos", "e", "esto", "mí", "antes", "algunos", "qué",
    "unos", "yo", "otro", "otras", "otra", "él", "tanto", "esa", "estos",
    "mucho", "quienes", "nada", "muchos", "cual", "sea", "poco", "ella",
    "estar", "estas", "algunas", "algo", "nosotros", "mi", "mis", "tú",
    "te", "ti", "tu", "tus", "ellas", "nosotras", "vosotros", "vosotras",
    "os", "mío", "mía", "míos", "mías", "tuyo", "tuya", "tuyos", "tuyas",
    "suyo", "suya", "suyos", "suyas", "nuestro", "nuestra", "nuestros",
    "nuestras", "vuestro", "vuestra", "vuestros", "vuestras", "esos", "esas",
    "estoy", "estás", "está", "estamos", "estáis", "están", "esté", "estés",
    "estemos", "estéis", "estén", "estaré", "estarás", "estará", "estaremos",
    "estaréis", "estarán", "estaría", "estarías", "estaríamos", "estaríais",
    "estarían", "estaba", "estabas", "estábamos", "estabais", "estaban",
    "estuve", "estuviste", "estuvo", "estuvimos", "estuvisteis", "estuvieron",
  ])

  const words = text
    .replace(/[^\w\sáéíóúñ]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopWords.has(w))

  const unique = [...new Set(words)]
  return unique.slice(0, 5)
}
