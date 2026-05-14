export const $ = (selector: string) => document.querySelector(selector)! as HTMLElement;
export const $$ = (selector: string) => document.querySelectorAll(selector)! as unknown as HTMLElement[];