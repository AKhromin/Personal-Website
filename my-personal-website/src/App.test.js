import { render, screen } from '@testing-library/react';
import App from './App';

test('renders about section', () => {
  render(<App />);
  const aboutElement = screen.getByText(/About Me/i);
  expect(aboutElement).toBeInTheDocument();
});
