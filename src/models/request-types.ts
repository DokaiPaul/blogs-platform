import {Request} from "express";

export type RequestWithParamsAndQuery<P, Q> = Request<P,{},{},Q>
export type RequestWithQuery<Q> = Request<{},{},{},Q>