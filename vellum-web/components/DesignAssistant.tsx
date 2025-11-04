'use client'

import { useState, useEffect } from 'react'
import { useBookStore } from '@/lib/store'
import { Sparkles, Lightbulb, CheckCircle, AlertCircle } from 'lucide-react'

interface TemplateRecommendation {
  templateId: string
  templateName: string
  score: number
  reason: string
}

export default function DesignAssistant() {
  const { currentProject } = useBookStore()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [recommendations, setRecommendations] = useState<TemplateRecommendation[]>([])
  const [analysis, setAnalysis] = useState<{
    genre: string
    tone: string
    audience: string
    complexity: string
  } | null>(null)

  useEffect(() => {
    if (currentProject) {
      analyzeManuscript()
    }
  }, [currentProject])

  const analyzeManuscript = async () => {
    if (!currentProject) return

    setIsAnalyzing(true)

    // Simulate AI analysis (in production, this would call an AI API)
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Analyze the manuscript content
    const allContent = currentProject.chapters
      .map(ch => `${ch.title}\n${ch.content}`)
      .join('\n\n')

    // Detect genre and tone
    const analysis = detectGenreAndTone(allContent)
    setAnalysis(analysis)

    // Generate recommendations
    const recs = generateRecommendations(analysis)
    setRecommendations(recs)

    setIsAnalyzing(false)
  }

  const detectGenreAndTone = (content: string): {
    genre: string
    tone: string
    audience: string
    complexity: string
  } => {
    const lowerContent = content.toLowerCase()

    // Genre detection
    let genre = 'Fiction'
    if (lowerContent.includes('research') || lowerContent.includes('study') || lowerContent.includes('analysis')) {
      genre = 'Academic'
    } else if (lowerContent.includes('business') || lowerContent.includes('strategy') || lowerContent.includes('market')) {
      genre = 'Business'
    } else if (lowerContent.includes('guide') || lowerContent.includes('how to') || lowerContent.includes('step')) {
      genre = 'Non-fiction / Guide'
    }

    // Tone detection
    let tone = 'Neutral'
    if (lowerContent.includes('discover') || lowerContent.includes('journey') || lowerContent.includes('adventure')) {
      tone = 'Inspiring'
    } else if (lowerContent.includes('data') || lowerContent.includes('result') || lowerContent.includes('finding')) {
      tone = 'Analytical'
    } else if (lowerContent.includes('beautiful') || lowerContent.includes('elegant') || lowerContent.includes('artistic')) {
      tone = 'Refined'
    }

    // Audience
    const audience = genre === 'Academic' ? 'Academic/Professional' :
                     genre === 'Business' ? 'Business Professionals' :
                     'General Readers'

    // Complexity
    const avgWordLength = content.split(' ').reduce((acc, word) => acc + word.length, 0) / content.split(' ').length
    const complexity = avgWordLength > 6 ? 'High' : avgWordLength > 5 ? 'Medium' : 'Low'

    return { genre, tone, audience, complexity }
  }

  const generateRecommendations = (analysis: {
    genre: string
    tone: string
    audience: string
    complexity: string
  }): TemplateRecommendation[] => {
    const recs: TemplateRecommendation[] = []

    // Academic content
    if (analysis.genre === 'Academic') {
      recs.push({
        templateId: 'academic',
        templateName: 'Academic',
        score: 95,
        reason: 'Perfect for scholarly work with professional margins and footnote support'
      })
      recs.push({
        templateId: 'corporate-blue',
        templateName: 'Corporate Blue',
        score: 85,
        reason: 'Clean, professional design ideal for research presentations'
      })
    }

    // Business content
    if (analysis.genre === 'Business') {
      recs.push({
        templateId: 'modern-sans',
        templateName: 'Modern Sans',
        score: 92,
        reason: 'Contemporary design that conveys professionalism and clarity'
      })
      recs.push({
        templateId: 'slate-modern',
        templateName: 'Slate Modern',
        score: 88,
        reason: 'Sophisticated layout perfect for business literature'
      })
    }

    // Fiction/Literary
    if (analysis.genre === 'Fiction') {
      if (analysis.tone === 'Refined') {
        recs.push({
          templateId: 'serif-classic',
          templateName: 'Serif Classic',
          score: 94,
          reason: 'Traditional elegance with drop caps, perfect for literary fiction'
        })
        recs.push({
          templateId: 'elegant-gold',
          templateName: 'Golden Elegance',
          score: 90,
          reason: 'Sophisticated design with warm tones for refined narratives'
        })
      } else {
        recs.push({
          templateId: 'modern-sans',
          templateName: 'Modern Sans',
          score: 88,
          reason: 'Clean, contemporary design that keeps focus on your story'
        })
      }
    }

    // Default recommendations
    if (recs.length === 0) {
      recs.push({
        templateId: 'luxury-lab',
        templateName: 'Luxury Laboratory',
        score: 85,
        reason: 'Modern, professional design suitable for any genre'
      })
      recs.push({
        templateId: 'serif-classic',
        templateName: 'Serif Classic',
        score: 82,
        reason: 'Timeless design that works beautifully for most books'
      })
    }

    return recs.slice(0, 3) // Top 3 recommendations
  }

  if (!currentProject) return null

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">AI Design Assistant</h3>
            <p className="text-sm text-gray-600">Analyzing your manuscript for perfect template matches</p>
          </div>

          {isAnalyzing ? (
            <div className="flex items-center gap-3 py-4">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-700">Analyzing manuscript...</span>
            </div>
          ) : analysis ? (
            <div className="space-y-4">
              {/* Analysis Results */}
              <div className="bg-white rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-gray-900">Genre:</span>
                  <span className="text-gray-700">{analysis.genre}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-gray-900">Tone:</span>
                  <span className="text-gray-700">{analysis.tone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-gray-900">Target Audience:</span>
                  <span className="text-gray-700">{analysis.audience}</span>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-600" />
                  Recommended Templates
                </h4>

                <div className="space-y-2">
                  {recommendations.map((rec, index) => (
                    <div
                      key={rec.templateId}
                      className="bg-white rounded-lg p-4 border-2 border-blue-200 hover:border-blue-400 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-bold text-gray-900">{rec.templateName}</div>
                          <div className="text-xs text-gray-500">Match: {rec.score}%</div>
                        </div>
                        {index === 0 && (
                          <span className="px-2 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-full">
                            BEST MATCH
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{rec.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro Tips */}
              <div className="bg-blue-100 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-900">
                    <span className="font-bold">Pro Tip:</span> Click any template in the carousel to see your book rendered in that style. The live preview updates instantly!
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
