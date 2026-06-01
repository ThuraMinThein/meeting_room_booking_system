import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseStringArrayPipe implements PipeTransform<string | string[], string[] | undefined> {
    constructor(
        private readonly valueName: string,
        private readonly allowedValues?: string[]
    ) { }

    transform(value: string | string[]): string[] | undefined {
        const formatErrorMessage = `Invalid array format of ${this.valueName}`;
        const valueErrorMessage = `Invalid value in ${this.valueName}, ${this.valueName} must be array of the following values: ${this.allowedValues}`;
        try {
            if (!value) {
                return undefined;
            }
            const parsedValue = Array.isArray(value) ? value : JSON.parse(value);
            if (!Array.isArray(parsedValue)) {
                throw new Error(formatErrorMessage);
            }

            if (parsedValue.length === 0) {
                return undefined;
            }

            const filteredArray = parsedValue.filter((item: any) =>
                !this.allowedValues || this.allowedValues.includes(item)
            );

            if (this.allowedValues && filteredArray.length !== parsedValue.length) {
                throw new Error(valueErrorMessage);
            }

            return filteredArray.map((item: any) => String(item));
        } catch (error: any) {
            throw new BadRequestException(error.message);
        }
    }
}