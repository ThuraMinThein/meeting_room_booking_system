import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseBooleanPipe implements PipeTransform<string> {
    constructor(private readonly valueName: string) { }

    transform(value: string): boolean | undefined {
        const errorMessage = `Invalid ${this.valueName} value, ${this.valueName} must be 'true', 'false', '1', or '0'`;

        try {
            if (value === undefined || value === null) {
                return;
            }

            if (value === 'true' || value === '1' || value) {
                return true;
            } else if (value === 'false' || value === '0' || !value) {
                return false;
            } else {
                throw new Error(errorMessage);
            }
        } catch (error: any) {
            throw new BadRequestException(error.message);
        }
    }
}
