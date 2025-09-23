import React, { useState, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeframe, setTimeframe] = useState('30d')

  const fetchAnalytics = async (tf = timeframe) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE}/api/analytics/stats?timeframe=${tf}`)
      const result = await response.json()
      
      if (result.success) {
        setAnalyticsData(result.data)
      } else {
        setError(result.error || 'Failed to fetch analytics')
      }
    } catch (err) {
      setError('Error fetching analytics: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const handleTimeframeChange = (tf) => {
    setTimeframe(tf)
    fetchAnalytics(tf)
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num || 0)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}>
          Loading analytics...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '0.5rem' }}>
          <strong>Error:</strong> {error}
          <button 
            onClick={() => fetchAnalytics()} 
            style={{ marginLeft: '1rem', padding: '0.25rem 0.5rem', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Website Analytics</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['7d', '30d', '90d', 'all'].map((tf) => (
            <button
              key={tf}
              onClick={() => handleTimeframeChange(tf)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: timeframe === tf ? '#3b82f6' : '#f3f4f6',
                color: timeframe === tf ? 'white' : '#374151',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              {tf === 'all' ? 'All Time' : tf.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {analyticsData && (
        <>
          {/* Overall Stats */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Overall Statistics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {analyticsData.overall?.map((stat) => (
                <div key={stat.page_type} style={{ padding: '1.5rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', textTransform: 'capitalize', color: '#374151' }}>{stat.page_type}</h4>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.25rem' }}>
                    {formatNumber(stat.total_visits)}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {formatNumber(stat.unique_visitors)} unique visitors
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Sketches */}
          {analyticsData.topSketches?.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Top Sketches</h3>
              <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f9fafb' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Sketch ID</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600', color: '#374151' }}>Total Visits</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600', color: '#374151' }}>Unique Visitors</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Last Visit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.topSketches.map((sketch, index) => (
                      <tr key={sketch.sketch_id} style={{ borderTop: index > 0 ? '1px solid #f3f4f6' : 'none' }}>
                        <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.875rem' }}>{sketch.sketch_id}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600' }}>{formatNumber(sketch.total_visits)}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>{formatNumber(sketch.unique_visitors)}</td>
                        <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>{formatDate(sketch.last_visit)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Detailed Breakdown */}
          {analyticsData.detailed?.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Detailed Breakdown</h3>
              <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f9fafb' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Page Type</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Page ID</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600', color: '#374151' }}>Total Visits</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600', color: '#374151' }}>Unique Visitors</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Last Visit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.detailed.map((item, index) => (
                      <tr key={`${item.page_type}-${item.page_id}`} style={{ borderTop: index > 0 ? '1px solid #f3f4f6' : 'none' }}>
                        <td style={{ padding: '0.75rem', textTransform: 'capitalize' }}>{item.page_type}</td>
                        <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.875rem' }}>{item.page_id || 'N/A'}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600' }}>{formatNumber(item.total_visits)}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>{formatNumber(item.unique_visitors)}</td>
                        <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>{formatDate(item.last_visit)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          {analyticsData.recentActivity?.length > 0 && (
            <div>
              <h3 style={{ marginBottom: '1rem' }}>Recent Activity (Last 24 Hours)</h3>
              <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f9fafb' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Time</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Page Type</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Page ID</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600', color: '#374151' }}>Visit Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.recentActivity.slice(0, 20).map((activity, index) => (
                      <tr key={index} style={{ borderTop: index > 0 ? '1px solid #f3f4f6' : 'none' }}>
                        <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>{formatDate(activity.updated_at)}</td>
                        <td style={{ padding: '0.75rem', textTransform: 'capitalize' }}>{activity.page_type}</td>
                        <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontSize: '0.875rem' }}>{activity.page_id || 'N/A'}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>{formatNumber(activity.visit_count)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AnalyticsPage