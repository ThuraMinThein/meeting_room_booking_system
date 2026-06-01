import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseStringPipe implements PipeTransform<string> {
    constructor(
        private readonly valueName: string,
        private readonly allowedValues?: string[]
    ) { }

    transform(value: string): string | undefined {
        const errorMessage = `Invalid ${this.valueName} value, ${this.valueName} must be one of the following values: ${this.allowedValues}`;
        try {
            if (!value) {
                return undefined;
            }

            if (!this.allowedValues?.includes(value)) {
                throw new Error(errorMessage);
            }

            return value;
        } catch (error: any) {
            throw new BadRequestException(error.message);
        }
    }
}