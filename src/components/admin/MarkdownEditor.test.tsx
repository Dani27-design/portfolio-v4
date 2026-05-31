import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { MarkdownEditor } from './MarkdownEditor';

describe('MarkdownEditor', () => {
  it('renders a textarea', () => {
    const { container } = render(<MarkdownEditor value="" onChange={vi.fn()} />);
    expect(container.querySelector('textarea')).toBeTruthy();
  });

  it('displays the value in textarea', () => {
    const { container } = render(<MarkdownEditor value="# Hello" onChange={vi.fn()} />);
    const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.value).toBe('# Hello');
  });

  it('calls onChange when typing', () => {
    const onChange = vi.fn();
    const { container } = render(<MarkdownEditor value="" onChange={onChange} />);
    const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'New content' } });
    expect(onChange).toHaveBeenCalledWith('New content');
  });

  it('renders toolbar buttons', () => {
    const { container } = render(<MarkdownEditor value="" onChange={vi.fn()} />);
    const buttons = container.querySelectorAll('button[title]');
    expect(buttons.length).toBeGreaterThanOrEqual(7);
  });

  it('renders mode toggle buttons', () => {
    const { container } = render(<MarkdownEditor value="" onChange={vi.fn()} />);
    // Edit and Preview buttons exist
    const allButtons = container.querySelectorAll('button');
    expect(allButtons.length).toBeGreaterThanOrEqual(9);
  });

  it('shows placeholder text', () => {
    const { container } = render(<MarkdownEditor value="" onChange={vi.fn()} placeholder="Custom placeholder" />);
    const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.placeholder).toBe('Custom placeholder');
  });
});
