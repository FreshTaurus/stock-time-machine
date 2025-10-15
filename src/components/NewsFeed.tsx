'use client'

import { NewsArticle } from '@/types'
import { ExternalLink, Calendar, Newspaper } from 'lucide-react'
import { format } from 'date-fns'

interface NewsFeedProps {
  news: NewsArticle[]
  date: Date
}

export function NewsFeed({ news, date }: NewsFeedProps) {
  if (!news.length) {
    return (
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Newspaper className="h-5 w-5 text-primary-600" />
          <h3 className="text-lg font-semibold">News & Events</h3>
        </div>
        <div className="flex items-center justify-center h-32 text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📰</div>
            <p>No news available for this date</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Newspaper className="h-5 w-5 text-primary-600" />
        <h3 className="text-lg font-semibold">News & Events</h3>
        <span className="text-sm text-gray-500">
          {format(date, 'MMM dd, yyyy')}
        </span>
      </div>
      
      <div className="space-y-4">
        {news.map((article) => (
          <div
            key={article.id}
            className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow dark:bg-gray-700"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                  {article.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(article.publishedAt), 'MMM dd, yyyy HH:mm')}
                  </div>
                  <div className="font-medium">{article.source}</div>
                </div>
              </div>
              
              {article.urlToImage && (
                <div className="flex-shrink-0">
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-20 h-20 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-600">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
              >
                Read more
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
