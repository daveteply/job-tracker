'use client';

import { useState } from 'react';

import ExcelJS from 'exceljs';

import { TrackerDatabase } from '@job-tracker/data-access';

import { ContentCard } from '../common/data-display/content-card';

export interface DataManagementProps {
  db: TrackerDatabase | null;
  translations: {
    title: string;
    exportExcel: string;
    exportDescription: string;
    exporting: string;
    clearDataTitle: string;
    clearDataDescription: string;
    clearDataButton: string;
  };
  onClearDataClick: () => void;
}

export function DataManagement({ db, translations, onClearDataClick }: DataManagementProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!db || isExporting) return;
    setIsExporting(true);
    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Vireo Job Tracker';
      workbook.lastModifiedBy = 'Vireo Job Tracker';
      workbook.created = new Date();

      const collections = Object.values(db.collections).filter((c) => c.name !== 'eventTypes');

      for (const collection of collections) {
        const docs = await collection.find().exec();
        const sheet = workbook.addWorksheet(collection.name);

        if (docs.length > 0) {
          const keys = Array.from(
            new Set(
              docs.flatMap((d: { toJSON: () => Record<string, unknown> }) =>
                Object.keys(d.toJSON()),
              ),
            ),
          );
          sheet.columns = keys.map((key) => ({ header: String(key), key: String(key) }));
          sheet.addRows(docs.map((d: { toJSON: () => Record<string, unknown> }) => d.toJSON()));
        }
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vireo_data_${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <ContentCard title={translations.title}>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold">{translations.exportExcel}</h3>
          <p className="text-base-content/60 text-sm">{translations.exportDescription}</p>
          <button
            className={`btn btn-outline btn-sm w-fit ${isExporting ? 'btn-disabled' : ''}`}
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <span className="loading loading-spinner"></span>
                {translations.exporting}
              </>
            ) : (
              translations.exportExcel
            )}
          </button>
        </div>

        <div className="divider"></div>

        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-error font-semibold">{translations.clearDataTitle}</h3>
            <p className="text-base-content/60 text-sm">{translations.clearDataDescription}</p>
          </div>

          <button className="btn btn-error btn-sm w-fit" onClick={onClearDataClick}>
            {translations.clearDataButton}
          </button>
        </div>
      </div>
    </ContentCard>
  );
}

export default DataManagement;
