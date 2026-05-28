import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TagComponent from './TagComponent';

describe('TagComponent', () => {
  const baseProps = {
    id: 'upload-tags',
    label: 'Tags',
    placeholder: 'Saisir un tag',
    value: '',
    suggestions: [],
    tags: [],
    onChange: vi.fn(),
    onAdd: vi.fn(),
    onRemove: vi.fn(),
  };

  it('23.1 affiche le label et l\'input', () => {
    /* Arrange / Act */
    render(<TagComponent {...baseProps} />);

    /* Assert */
    expect(screen.getByLabelText('Tags')).toBeInTheDocument();
  });

  it('23.2 appelle onChange quand l\'utilisateur saisit', () => {
    /* Arrange */
    const onChange = vi.fn();
    render(<TagComponent {...baseProps} onChange={onChange} />);

    /* Act */
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'react' } });

    /* Assert */
    expect(onChange).toHaveBeenCalledWith('react');
  });

  it('23.3 appelle onAdd au clic sur le bouton +', async () => {
    /* Arrange */
    const onAdd = vi.fn();
    render(<TagComponent {...baseProps} onAdd={onAdd} />);

    /* Act */
    await userEvent.click(screen.getByRole('button', { name: 'Ajouter le tag' }));

    /* Assert */
    expect(onAdd).toHaveBeenCalledOnce();
  });

  it('23.4 affiche les tags sélectionnés comme chips', () => {
    /* Arrange / Act */
    render(<TagComponent {...baseProps} tags={['react', 'ts']} />);

    /* Assert */
    expect(screen.getByRole('button', { name: 'Retirer le tag react' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retirer le tag ts' })).toBeInTheDocument();
  });

  it('23.5 appelle onRemove au clic sur une chip', async () => {
    /* Arrange */
    const onRemove = vi.fn();
    render(<TagComponent {...baseProps} tags={['react']} onRemove={onRemove} />);

    /* Act */
    await userEvent.click(screen.getByRole('button', { name: 'Retirer le tag react' }));

    /* Assert */
    expect(onRemove).toHaveBeenCalledWith('react');
  });
});
