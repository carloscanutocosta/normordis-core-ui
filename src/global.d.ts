// Declarações de tipo ambiente para imports de efeito lateral (side-effect)
// não cobertos por tipagem própria — necessário desde o TypeScript 7, que
// passou a validar também estes imports (erro TS2882).
declare module '*.css';
