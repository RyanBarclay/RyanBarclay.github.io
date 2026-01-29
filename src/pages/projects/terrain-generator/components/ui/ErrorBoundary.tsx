/**
 * ErrorBoundary Component
 * 
 * React error boundary for graceful failure handling in the terrain generator.
 * Catches JavaScript errors anywhere in the component tree and displays a fallback UI.
 * 
 * Features:
 * - Material-UI styled error display
 * - Error message display
 * - Reload button to recover from errors
 * - Console logging for debugging
 * 
 * Phase F - Group 1A: Loading States & Error Boundaries
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary class component
 * 
 * Provides error boundary functionality for the terrain generator.
 * Must be a class component to use componentDidCatch lifecycle method.
 * 
 * @example
 * <ErrorBoundary>
 *   <TerrainProvider>
 *     <TerrainCanvas />
 *   </TerrainProvider>
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  /**
   * Update state when error is caught
   */
  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  /**
   * Log error details to console
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Terrain Generator Error:', error, errorInfo);
  }

  /**
   * Reset error state and reload page
   */
  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            p: 3
          }}
        >
          <Paper
            sx={{
              p: 4,
              maxWidth: 500,
              textAlign: 'center'
            }}
            elevation={3}
          >
            <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Typography>
            <Button
              variant="contained"
              onClick={this.handleReset}
              size="large"
            >
              Reload Page
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}
