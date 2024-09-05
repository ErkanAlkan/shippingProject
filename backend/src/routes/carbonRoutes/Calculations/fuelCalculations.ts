import express from 'express';

function powerRequired(v: number, k: number): number {
    return k * Math.pow(v, 3);
}

function powerRequiredModified(v: number, w: number, A: number, m: number, n: number): number {
    return m * Math.pow((A + w), 2 / 3) * Math.pow(v, n);
}
