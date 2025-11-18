import { useState, useEffect } from 'react';
import { History, Trash2, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
  getHistory,
  clearHistory,
  deleteHistoryEntry,
  formatHistoryDate,
  type CalculationEntry,
} from '../lib/calculationHistory';

interface CalculationHistoryProps {
  calculatorType: string;
  onLoadCalculation?: (inputs: Record<string, any>) => void;
  className?: string;
}

export function CalculationHistory({
  calculatorType,
  onLoadCalculation,
  className = '',
}: CalculationHistoryProps) {
  const [history, setHistory] = useState<CalculationEntry[]>([]);
  const [expanded, setExpanded] = useState(false);
  const showCount = 3;

  useEffect(() => {
    loadHistory();
  }, [calculatorType]);

  const loadHistory = () => {
    const entries = getHistory(calculatorType);
    setHistory(entries);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your calculation history?')) {
      clearHistory(calculatorType);
      loadHistory();
    }
  };

  const handleDeleteEntry = (id: string) => {
    deleteHistoryEntry(id);
    loadHistory();
  };

  const handleLoadEntry = (entry: CalculationEntry) => {
    if (onLoadCalculation) {
      onLoadCalculation(entry.inputs);
    }
  };

  const formatInputs = (inputs: Record<string, any>): string => {
    return Object.entries(inputs)
      .filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      .map(([key, value]) => {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').trim();
        const capitalizedKey = formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
        return `${capitalizedKey}: ${value}`;
      })
      .join(', ');
  };

  if (history.length === 0) {
    return null;
  }

  const displayedHistory = expanded ? history : history.slice(0, showCount);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="w-5 h-5" />
            Recent Calculations
          </CardTitle>
          {history.length > 0 && (
            <Button
              onClick={handleClearHistory}
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayedHistory.map((entry) => (
            <div
              key={entry.id}
              className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-3 h-3 text-gray-500 flex-shrink-0" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatHistoryDate(entry.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                    {formatInputs(entry.inputs)}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {onLoadCalculation && (
                    <Button
                      onClick={() => handleLoadEntry(entry)}
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 px-2"
                    >
                      Load
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDeleteEntry(entry.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-7 w-7 p-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {history.length > showCount && (
          <Button
            onClick={() => setExpanded(!expanded)}
            variant="ghost"
            className="w-full mt-3 text-sm"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Show {history.length - showCount} More
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
