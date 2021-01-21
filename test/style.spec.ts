import { Property, InlineAtRule } from '../src/utils/style';

describe('Property', () => {
    it('normal build', () => {
        const p1 = new Property('padding', '1rem');
        const p2 = new Property(['padding-left', 'padding-right'], '1rem');

        expect(p1.build()).toBe('padding: 1rem;');
        expect(p2.build()).toBe('padding-left: 1rem;\npadding-right: 1rem;')
    })
    it('minimized build', () => {
        const p1 = new Property('padding', '1rem');
        const p2 = new Property(['padding-left', 'padding-right'], '1rem');

        expect(p1.build(true)).toBe('padding:1rem;');
        expect(p2.build(true)).toBe('padding-left:1rem;padding-right:1rem;');
    });

    it('undefiend value', () => {
        const p = new Property('padding');

        expect(p.build()).toBe('');
    })

    it('initial with comment', () => {
        const p1 = new Property('padding', '1rem', 'p-4');
        const p2 = new Property(['padding-left', 'padding-right'], '1rem', 'px-4');

        expect(p1.build()).toBe('padding: 1rem; /* p-4 */');
        expect(p2.build()).toBe('padding-left: 1rem; /* px-4 */\npadding-right: 1rem; /* px-4 */');

        expect(p1.build(true)).toBe('padding:1rem;');
        expect(p2.build(true)).toBe('padding-left:1rem;padding-right:1rem;');
    })

    it('parse', () => {
        const p1 = Property.parse('padding-left:1rem');
        const p2 = Property.parse('   padding-right : 1rem ;  ');
        const p3 = Property.parse('padding-left:1rem;padding-right:2rem;');
        const p4 = Property.parse('padding-left:1rem;  padding-right:2rem');
        const p5 = Property.parse('padding;');
        const p6 = Property.parse('@apply font-bold text-lg ;');
        const p7 = Property.parse('padding:1rem;@apply font-bold;');

        expect(!(p1 instanceof Property) || [p1.name, p1.value]).toEqual(['padding-left', '1rem']);

        expect(!(p2 instanceof Property) || [p2.name, p2.value]).toEqual(['padding-right', '1rem']);

        expect(!(Array.isArray(p3)) || p3.map(i=>[i.name, i.value])).toEqual([['padding-left', '1rem'], ['padding-right', '2rem']]);

        expect(!(Array.isArray(p4)) || p4.map(i=>[i.name, i.value])).toEqual([['padding-left', '1rem'], ['padding-right', '2rem']]);

        expect(p5).toBeUndefined();

        expect(!(p6 instanceof InlineAtRule) || [p6.name, p6.value]).toEqual(['apply', 'font-bold text-lg']);

        expect(!(Array.isArray(p7) && p7[0] instanceof Property && p7[1] instanceof InlineAtRule) || p7.map(i=>[i.name, i.value])).toEqual([['padding', '1rem'], ['apply', 'font-bold']]);
    })

    it('toStyle', () => {
        const p = new Property('padding', '1rem');

        expect(p.toStyle().build()).toEqual('padding: 1rem;');
        expect(p.toStyle('.p-4').build()).toEqual('.p-4 {\n  padding: 1rem;\n}');
        expect(p.toStyle('.sm:p-4', true).build()).toEqual('.sm\\:p-4 {\n  padding: 1rem;\n}');
        expect(p.toStyle('.sm:p-4', false).build()).toEqual('.sm:p-4 {\n  padding: 1rem;\n}');
    })
});

describe('InlineAtRule', () => {
    it('build', () => {
        const r1 = new InlineAtRule('apply', 'font-bold text-md');
        const r2 = new InlineAtRule('apply');

        expect(r1.build()).toBe('@apply font-bold text-md;');
        expect(r2.build()).toBe('@apply;');
    })

    it('parse', () => {
        const r1 = InlineAtRule.parse('@apply  ');
        const r2 = InlineAtRule.parse('@apply font-bold text-md;');
        const r3 = InlineAtRule.parse('  @apply  font-bold text-md ');
        const r4 = InlineAtRule.parse('@apply;');

        expect(!r1 || r1.name).toBe('apply');
        expect(!r1 || r1.value).toBeUndefined();

        expect(!r2 || r2.name).toBe('apply');
        expect(!r2 || r2.value).toBe('font-bold text-md');

        expect(!r3 || r3.name).toBe('apply');
        expect(!r3 || r3.value).toBe('font-bold text-md');

        expect(!r4 || r4.name).toBe('apply');
        expect(!r4 || r4.value).toBeUndefined();
    })
})