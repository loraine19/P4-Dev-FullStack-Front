import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TagComponent from './TagComponent';
import type { Tag } from '../../../types/tag.types';

const makeTag = (id: number, name: string): Tag => ({ id, name });

describe('TagComponent', () => {
  const baseProps = {
    id: 'upload-tags',
    label: 'Tags',
    placeholder: 'Saisir un tag',
    value: '',
    tags: [] as Tag[],
    selectedTags: [] as Tag[],
    setSelectedTags: vi.fn(),
    onChange: vi.fn(),
    onAdd: vi.fn(),
  };

  it('23.1 renders label and input', () => {
    /* Arrange / Act */
    render(<TagComponent {...baseProps} />);
    /* Assert */
    expect(screen.getByLabelText('Tags')).toBeInTheDocument();
  });

  it('23.2 calls onChange on user input', () => {
    /* Arrange */
    const onChange = vi.fn();
    render(<TagComponent {...baseProps} onChange={onChange} />);
    /* Act */
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'react' } });
    /* Assert */
    expect(onChange).toHaveBeenCalledWith('react');
  });

  it('23.3 shows + button after input', () => {
    /* Arrange */
    render(<TagComponent {...baseProps} />);
    /* Act */
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'nouveau' } });
    /* Assert */
    expect(screen.getByRole('button', { name: 'Ajouter le tag' })).toBeInTheDocument();
  });

  it('23.4 shows selected tags as chips', () => {
    /* Arrange / Act */
    render(
      <TagComponent
        {...baseProps}
        selectedTags={[makeTag(1, 'react'), makeTag(2, 'ts')]}
      />,
    );
    /* Assert */
    expect(screen.getByRole('button', { name: 'Retirer le tag react' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retirer le tag ts' })).toBeInTheDocument();
  });

  it('23.5 removes tag on chip click', async () => {
    /* Arrange */
    const setSelectedTags = vi.fn();
    render(
      <TagComponent
        {...baseProps}
        selectedTags={[makeTag(1, 'react')]}
        setSelectedTags={setSelectedTags}
      />,
    );
    /* Act */
    await userEvent.click(screen.getByRole('button', { name: 'Retirer le tag react' }));
    /* Assert */
    expect(setSelectedTags).toHaveBeenCalledWith([]);
  });
});
