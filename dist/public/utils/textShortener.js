String.prototype.short = function (maxLength) {
    return this.length > maxLength ? this.slice(0, maxLength) + "..." : this.toString();
};
export default {};
//# sourceMappingURL=textShortener.js.map