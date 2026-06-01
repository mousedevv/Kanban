String.prototype.short = function (maxLength: number) {
    return this.length > maxLength ? this.slice(0, maxLength) + "..." : this.toString();
};

export default {};