import type { Response } from "express";
import { ZodError } from "zod";

/** 
 * successResponse
 * @param {Response} res - Express Response object
 * @param {T} responseData - Response data
 * @param {String} message - Success message
 * @param {Number} statusCode - HTTP status code (default 200)
*/

export const successResponse = <T = unknown>(
    res: Response,
    responseData: T = {} as T,
    message = "Success",
    statusCode = 200
) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data: responseData,
    });
};

/** 
 * errorResponse
 * @param {Response} res - Express Response object
 * @param {String} message - Error message
 * @param {Number} statusCode - HTTP status code (default 500)
 * @param {Object} error - Error object
*/

export const errorResponse = (
    res: Response,
    message = "Something went wrong",
    statusCode = 500,
    error?: unknown
) => {

    //Handles Zod Validation Errors
    if (error instanceof ZodError) {
        const formattedErrors = error.issues.map(err => ({
            field: err.path[0],
            message: err.message
        }));

        return res.status(400).json({
            success: false,
            message,
            data: null,
            error: formattedErrors
        });
    }

    //Handles All Other Errors
    return res.status(statusCode).json({
        success: false,
        message,
        data: null,
        error // TODO: I think we should not send full error to client
    });
};



/**
 * Standard pagination response formatter
 * @param {Response} res - Express response object
 * @param {T[]} data - Array of results
 * @param {Number} page - Current page number
 * @param {Number} limit - Records per page
 * @param {String} message - Success message
 * @param {Number} statusCode - HTTP status code (default 200)
 */

export const paginationResponse = <T = unknown>(
    res: Response,
    data: T[],
    page: number,
    limit: number,
    message = "Success",
    statusCode = 200
) => {

    return res
        .status(statusCode)
        .json({
            success: true,
            data,
            message,
            meta: {
                page,
                limit,
                hasNextPage: data.length === limit,
                hasPrevPage: page > 1,
            },
        });
};