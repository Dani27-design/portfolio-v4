import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { ImageUpload } from './ImageUpload';

// Mock upload module
vi.mock('@/lib/upload', () => ({
  uploadImage: vi.fn(),
}));

describe('ImageUpload', () => {
  const defaultProps = {
    storagePath: 'test/path',
    onUpload: vi.fn(),
    onRemove: vi.fn(),
    label: 'Test Image',
  };

  it('renders the label', () => {
    const { container } = render(<ImageUpload {...defaultProps} />);
    expect(container.textContent).toContain('Test Image');
  });

  it('renders file input', () => {
    const { container } = render(<ImageUpload {...defaultProps} />);
    const input = container.querySelector('input[type="file"]');
    expect(input).toBeTruthy();
  });

  it('shows placeholder icon when no image', () => {
    const { container } = render(<ImageUpload {...defaultProps} />);
    // ImageIcon from lucide renders an SVG
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('shows preview when currentUrl is provided', () => {
    const { container } = render(<ImageUpload {...defaultProps} currentUrl="https://example.com/img.png" />);
    const img = container.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('https://example.com/img.png');
  });

  it('shows remove button when currentUrl exists', () => {
    const { container } = render(<ImageUpload {...defaultProps} currentUrl="https://example.com/img.png" />);
    expect(container.textContent).toContain('Remove');
  });

  it('rejects files that are too large', () => {
    const { container } = render(<ImageUpload {...defaultProps} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    const largeFile = new File(['x'.repeat(3 * 1024 * 1024)], 'big.png', { type: 'image/png' });
    Object.defineProperty(input, 'files', { value: [largeFile] });
    fireEvent.change(input);

    expect(container.textContent).toContain('smaller than 2MB');
  });

  it('rejects invalid file types', () => {
    const { container } = render(<ImageUpload {...defaultProps} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    const badFile = new File(['data'], 'file.gif', { type: 'image/gif' });
    Object.defineProperty(input, 'files', { value: [badFile] });
    fireEvent.change(input);

    expect(container.textContent).toContain('Only PNG, JPEG, and WebP');
  });
});
