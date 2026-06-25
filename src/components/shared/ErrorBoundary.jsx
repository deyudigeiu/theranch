import { Component } from "react";
import { G, btnG } from "../../lib/constants";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary:", error, info);
  }

  reset() {
    this.setState({ hasError: false, error: null });
    if (this.props.onBack) this.props.onBack();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "60px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#2D2D2D",
              marginBottom: 8,
            }}
          >
            Ceva n-a mers
          </div>
          <p
            style={{
              color: "#aaa",
              fontSize: 13,
              marginBottom: 24,
              fontFamily: "monospace",
            }}
          >
            {this.state.error?.message}
          </p>
          <button
            onClick={() => this.reset()}
            style={{ ...btnG({ width: "auto", padding: "14px 28px" }) }}
          >
            ← Înapoi acasă
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
