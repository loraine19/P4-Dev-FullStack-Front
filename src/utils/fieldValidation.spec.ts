import { describe, it, expect } from 'vitest';
import { validate, validateAll } from '../utils/fieldValidation';
import { RULES } from '../constants/validationRules';
import { LOGIN_INPUTS, REGISTER_INPUTS } from '../constants/formConfigs';
import type { FieldRules, TLoginField, TRegisterField } from '../constants/formConfigs';

const loginRules = Object.fromEntries(
  LOGIN_INPUTS.map((i) => [i.name, i.rules]),
) as FieldRules<TLoginField>;

const registerRules = Object.fromEntries(
  REGISTER_INPUTS.map((i) => [i.name, i.rules]),
) as FieldRules<TRegisterField>;

const pwMinMsg = REGISTER_INPUTS.find((i) => i.name === 'password')!.rules[1].message;


describe('RULES - factories', () => {
  describe('required()', () => {
    it('rejette valeur vide ou espace seul', () => {
      /* Arrange */
      const rule = RULES.required('Champ obligatoire');
      /* Act & Assert */
      expect(rule.test('')).toBe(false);
      expect(rule.test('   ')).toBe(false);
      expect(rule.message).toBe('Champ obligatoire');
    });

    it('accepte une valeur non vide', () => {
      /* Arrange */
      const rule = RULES.required('Champ obligatoire');
      /* Act & Assert */
      expect(rule.test('alice')).toBe(true);
    });
  });

  describe('email()', () => {
    it('valide une adresse email correcte', () => {
      /* Arrange */
      const rule = RULES.email('Email invalide');
      /* Act & Assert */
      expect(rule.test('alice@example.com')).toBe(true);
    });

    it('rejette une adresse malformée (sans @, sans domaine)', () => {
      /* Arrange */
      const rule = RULES.email('Email invalide');
      /* Act & Assert */
      expect(rule.test('aliceexample.com')).toBe(false);
      expect(rule.test('alice@')).toBe(false);
    });
  });

  describe('minLen()', () => {
    it('valide si longueur ≥ n', () => {
      /* Arrange */
      const rule = RULES.minLen(8, 'Min 8');
      /* Act & Assert */
      expect(rule.test('password')).toBe(true);
      expect(rule.test('12345678')).toBe(true);
    });

    it('rejette si longueur < n', () => {
      /* Arrange */
      const rule = RULES.minLen(8, 'Min 8');
      /* Act & Assert */
      expect(rule.test('short')).toBe(false);
    });
  });

  describe('matches()', () => {
    it('valide si les deux champs sont identiques', () => {
      /* Arrange */
      const rule = RULES.matches('password', 'Mots de passe non identiques');
      /* Act & Assert */
      expect(rule.test('abc123', { password: 'abc123' })).toBe(true);
    });

    it('rejette si les champs diffèrent ou si la référence est absente', () => {
      /* Arrange */
      const rule = RULES.matches('password', 'Mots de passe non identiques');
      /* Act & Assert */
      expect(rule.test('abc123', { password: 'xyz789' })).toBe(false);
      expect(rule.test('abc123', {})).toBe(false);
    });
  });
});

describe('1 - validateLoginField()', () => {
  it('1.1.1 champs valides → pas de message d\'erreur', () => {
    /* Arrange */
    const values = { email: 'alice@test.com', password: 'password123' };

    /* Act */
    const errors = validateAll(values, loginRules);

    /* Assert */
    expect(errors.email).toBe('');
    expect(errors.password).toBe('');
  });

  it('1.1.2 email vide / format invalide → message d\'erreur', () => {
    /* Arrange */
    const emptyEmail  = { email: '',             password: 'password' };
    const badFmtEmail = { email: 'not-an-email', password: 'password' };

    /* Act */
    const errorsEmpty  = validateAll(emptyEmail,  loginRules);
    const errorsBadFmt = validateAll(badFmtEmail, loginRules);

    /* Assert */
    expect(errorsEmpty.email).toBeTruthy();
    expect(errorsBadFmt.email).toBeTruthy();
  });

  it('1.1.3 password vide → message d\'erreur', () => {
    /* Arrange */
    const values = { email: 'alice@test.com', password: '' };

    /* Act */
    const errors = validateAll(values, loginRules);

    /* Assert */
    expect(errors.password).toBeTruthy();
  });
});


describe('2 - validateRegisterField()', () => {
  it('1.2.1 tous champs valides → chaîne vide pour chaque champ', () => {
    /* Arrange */
    const values = {
      name:            'alice',
      email:           'alice@test.com',
      password:        'password123',
      passwordConfirm: 'password123',
    };

    /* Act */
    const errors = validateAll(values, registerRules);

    /* Assert */
    expect(errors.name).toBe('');
    expect(errors.email).toBe('');
    expect(errors.password).toBe('');
    expect(errors.passwordConfirm).toBe('');
  });

  it('1.2.2 pw < 8 / passwordConfirm ≠ pw / username vide → messages d\'erreur', () => {
    /* Arrange */
    const values = {
      name:            '',
      email:           'alice@test.com',
      password:        'short',
      passwordConfirm: 'different',
    };

    /* Act */
    const errors = validateAll(values, registerRules);

    /* Assert */
    expect(errors.name).toBeTruthy();
    expect(errors.password).toBe(pwMinMsg);
    expect(errors.passwordConfirm).toBeTruthy();
  });
});


describe('3 - FieldValidator (validate / validateAll)', () => {
  it('1.3.1 validate() retourne la 1ère erreur · validateAll() retourne l\'objet complet', () => {
    /* Arrange */
    const singleRules = [RULES.required('Obligatoire'), RULES.minLen(8, 'Min 8')];
    const formValues  = { name: '', tag: 'hi' };
    const formRules   = {
      name: [RULES.required('Nom requis')],
      tag:  [RULES.required('Requis'), RULES.minLen(5, 'Min 5')],
    };

    /* Act */
    const firstError = validate('', singleRules);
    const noError    = validate('validpassword', singleRules);
    const allErrors  = validateAll(formValues, formRules);

    /* Assert */
    expect(firstError).toBe('Obligatoire');
    expect(noError).toBe('');
    expect(allErrors.name).toBeTruthy();
    expect(allErrors.tag).toBeTruthy();
  });
});
