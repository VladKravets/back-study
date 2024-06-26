import {Request, Response} from 'express'

export type RequestsWithBody<T> = Request<{}, {}, T>
export type RequestsWithQuery<T> = Request<{}, {}, {}, T>
export type RequestsWithParams<T> = Request<T>
export type RequestsWithParamsAndBody<T, B> = Request<T,{},B>
