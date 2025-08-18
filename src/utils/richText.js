import React from 'react';

/**
 * Utility functions for rendering rich text in sketch descriptions
 */

/**
 * Converts simple rich text markup to React elements
 * Supports:
 * - **bold text** 
 * - *italic text*
 * - Line breaks (\n)
 * - Basic HTML entities
 */
export const parseRichText = (text) => {
  if (!text) return []

  // Split by paragraphs (double line breaks)
  const paragraphs = text.split('\n\n')
  
  return paragraphs.map((paragraph, pIndex) => {
    if (!paragraph.trim()) return null
    
    // Process inline formatting within each paragraph
    const elements = parseInlineFormatting(paragraph)
    
    return (
      <p key={pIndex} className="mb-4 last:mb-0">
        {elements}
      </p>
    )
  }).filter(Boolean)
}

/**
 * Parses inline formatting like bold, italic, and line breaks
 */
const parseInlineFormatting = (text) => {
  const elements = []
  let currentIndex = 0
  
  // Process single line breaks within paragraphs
  const lines = text.split('\n')
  
  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) {
      elements.push(<br key={`br-${lineIndex}`} />)
    }
    
    // Process formatting within the line
    const formattedLine = processTextFormatting(line, currentIndex)
    elements.push(...formattedLine)
    currentIndex += line.length
  })
  
  return elements
}

/**
 * Processes text formatting like bold and italic
 */
const processTextFormatting = (text, startIndex = 0) => {
  const elements = []
  let remaining = text
  let elementIndex = startIndex
  
  while (remaining.length > 0) {
    // Look for bold text (**text**)
    const boldMatch = remaining.match(/^\*\*(.*?)\*\*/)
    if (boldMatch) {
      elements.push(
        <strong key={`bold-${elementIndex}`} className="font-semibold">
          {boldMatch[1]}
        </strong>
      )
      remaining = remaining.slice(boldMatch[0].length)
      elementIndex++
      continue
    }
    
    // Look for italic text (*text*)
    const italicMatch = remaining.match(/^\*(.*?)\*/)
    if (italicMatch) {
      elements.push(
        <em key={`italic-${elementIndex}`} className="italic">
          {italicMatch[1]}
        </em>
      )
      remaining = remaining.slice(italicMatch[0].length)
      elementIndex++
      continue
    }
    
    // Look for the next formatting marker
    const nextFormatIndex = remaining.search(/\*/)
    
    if (nextFormatIndex === -1) {
      // No more formatting, add remaining text
      if (remaining.trim()) {
        elements.push(remaining)
      }
      break
    } else if (nextFormatIndex > 0) {
      // Add text before the next formatting marker
      elements.push(remaining.slice(0, nextFormatIndex))
      remaining = remaining.slice(nextFormatIndex)
      elementIndex++
    } else {
      // Invalid formatting, treat as regular text
      elements.push(remaining[0])
      remaining = remaining.slice(1)
    }
  }
  
  return elements
}

/**
 * Alternative: Simple HTML parser for more advanced formatting
 * Allows basic HTML tags like <strong>, <em>, <br>, <p>
 */
export const parseSimpleHTML = (text) => {
  if (!text) return null
  
  // Convert line breaks to <br> tags if not already present
  let processedText = text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')
  
  // Wrap in paragraph tags if not already wrapped
  if (!processedText.includes('<p>')) {
    processedText = `<p>${processedText}</p>`
  }
  
  return (
    <div 
      className="rich-text-content"
      dangerouslySetInnerHTML={{ __html: processedText }}
    />
  )
}

/**
 * Escape HTML entities for safety
 */
export const escapeHtml = (text) => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
