import React, { useState, useEffect, useCallback } from 'react'

export function LayoutGrid({ cards = [] }) {
  const [selected, setSelected] = useState(null)

  const handleSelect = (card) => {
    setSelected(card)
  }

  const close = useCallback(() => setSelected(null), [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close])

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Background grid (dim when modal open) */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${selected ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
        {cards.map((card) => (
          <div
            key={card.id}
            className={`${card.className || ''} relative overflow-hidden rounded-lg`}
          >
            {/* Make only the image clickable so overlay text doesn't block pointer events */}
            <img
              src={card.thumbnail}
              alt="thumb"
              className="w-full h-56 md:h-64 object-cover rounded cursor-pointer"
              onClick={() => handleSelect(card)}
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 p-6 flex items-end pointer-events-none">
              {/* Allow interactive elements inside content to receive clicks when needed */}
              <div className="pointer-events-auto">{card.content}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected overlay */}
      {selected && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-gray-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) close()
          }}
        >
          <div className="relative w-11/12 md:w-3/5 lg:w-2/4">
            <div
              className="rounded overflow-hidden shadow-2xl bg-black bg-center bg-cover"
              style={{ backgroundImage: `url('${selected.thumbnail}')` }}
            >
              <div className="bg-gradient-to-b from-transparent to-black/80 p-8 md:p-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{selected.content && selected.content.props ? (selected.content.props.children && typeof selected.content.props.children[0] === 'string' ? selected.content.props.children[0] : '') : ''}</h2>
                {/* Try to render description if available in children - fallback to empty */}
                <div className="text-sm md:text-base text-white/90 max-w-2xl">
                  {/* If content is a component that contains paragraphs, render a simple description by mounting the content prop inside a transparent wrapper */}
                  {selected.content}
                </div>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={close}
              aria-label="Close"
              className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LayoutGrid
