import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#0a0e0a', color: '#00ff41', fontFamily: 'Cairo, sans-serif',
          padding: '40px', textAlign: 'center', direction: 'rtl'
        }}>
          <div>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🛡️</div>
            <h1 style={{ fontSize: '24px', marginBottom: '12px' }}>عذراً، حدث خطأ غير متوقع</h1>
            <p style={{ color: '#888', marginBottom: '24px', fontSize: '14px' }}>
              {this.state.error.message}
            </p>
            <button onClick={() => {
              this.setState({ error: null })
              window.location.href = '/'
            }} style={{
              padding: '12px 32px', background: '#00ff41', border: 'none',
              borderRadius: '8px', color: '#000', fontWeight: 700, cursor: 'pointer', fontSize: '16px'
            }}>
              العودة للرئيسية
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
