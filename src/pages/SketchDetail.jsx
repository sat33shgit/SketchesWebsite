import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { getSketchById } from '../data/sketches'

const SketchDetail = () => {
  const { id } = useParams()
  const sketch = getSketchById(id)
  const [newComment, setNewComment] = useState('')
  
  // Mock comments data - in a real app, this would come from a backend
  const [comments] = useState([
    {
      id: 1,
      author: "Sophia Clark",
      avatar: "https://via.placeholder.com/40",
      content: "Absolutely stunning work! The level of detail is incredible, and the way you've captured the city's energy is truly remarkable.",
      timeAgo: "2 days ago",
      likes: 5
    },
    {
      id: 2,
      author: "Alex Carter",
      avatar: "https://via.placeholder.com/40",
      content: "I love the contrast between the light and shadow. It really brings the city to life. The perspective is also very well done.",
      timeAgo: "3 days ago",
      likes: 3
    },
    {
      id: 3,
      author: "Olivia Bennett",
      avatar: "https://via.placeholder.com/40",
      content: "This is one of the best pencil sketches I've ever seen. The detail in the buildings and the sense of movement are just breathtaking. You're incredibly talented!",
      timeAgo: "4 days ago",
      likes: 8
    }
  ])

  if (!sketch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sketch not found</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Return to Gallery
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmitComment = (e) => {
    e.preventDefault()
    if (newComment.trim()) {
      // In a real app, this would send the comment to a backend
      console.log('New comment:', newComment)
      setNewComment('')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-gray-700">Sketches</Link>
          <span>/</span>
          <span className="text-gray-900">{sketch.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <svg className="w-24 h-24 mx-auto text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-400 text-lg font-medium">No Image Available</p>
                  <p className="text-gray-300 text-sm mt-2">Sketch artwork will be displayed here</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Sketch Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{sketch.title}</h1>
              <p className="text-gray-600 text-sm mb-4">
                Completed: {new Date(sketch.completedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {sketch.description}
              </p>
            </div>

            {/* Comments Section */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Comments</h2>
              
              {/* Comments List */}
              <div className="space-y-6 mb-8">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <img
                      src={comment.avatar}
                      alt={comment.author}
                      className="w-10 h-10 rounded-full bg-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-semibold text-gray-900">{comment.author}</h4>
                        <span className="text-xs text-gray-500">{comment.timeAgo}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <button className="flex items-center space-x-1 hover:text-gray-700">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span>{comment.likes}</span>
                        </button>
                        <button className="hover:text-gray-700">Reply</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <div className="flex space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SketchDetail
