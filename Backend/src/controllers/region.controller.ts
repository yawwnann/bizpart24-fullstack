import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

// Helper to parse CSV simply Line by Line
const parseCSV = (filePath: string) => {
    try {
        const fileData = fs.readFileSync(filePath, 'utf-8');
        const lines = fileData.split('\n').filter(line => line.trim() !== '');
        return lines.map(line => line.split(',').map(item => item.trim()));
    } catch (error) {
        console.error(`Failed to read or parse file: ${filePath}`, error);
        return [];
    }
};

export class RegionController {

    // GET /api/v1/regions/provinces
    public getProvinces = (req: Request, res: Response, next: NextFunction) => {
        try {
            const filePath = path.join(__dirname, '../data/provinces.csv');
            const parsedData = parseCSV(filePath);
            
            // Format: id, name
            const provinces = parsedData.map(row => ({
                code: row[0],
                name: row[1]
            }));

            res.json({ success: true, data: provinces });
        } catch (error) {
            next(error);
        }
    };

    // GET /api/v1/regions/provinces/:provinceId/regencies
    public getRegencies = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { provinceId } = req.params;
            const filePath = path.join(__dirname, '../data/regencies.csv');
            const parsedData = parseCSV(filePath);
            
            // Format: id, provinceId, name
            const regencies = parsedData
                .filter(row => row[1] === provinceId)
                .map(row => ({
                    code: row[0],
                    provinceCode: row[1],
                    name: row[2]
                }));

            res.json({ success: true, data: regencies });
        } catch (error) {
            next(error);
        }
    };

    // GET /api/v1/regions/regencies/:regencyId/districts
    public getDistricts = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { regencyId } = req.params;
            const filePath = path.join(__dirname, '../data/districts.csv');
            const parsedData = parseCSV(filePath);
            
            // Format: id, regencyId, name
            const districts = parsedData
                .filter(row => row[1] === regencyId)
                .map(row => ({
                    code: row[0],
                    regencyCode: row[1],
                    name: row[2]
                }));

            res.json({ success: true, data: districts });
        } catch (error) {
            next(error);
        }
    };

}
