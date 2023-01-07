import { z } from 'zod';

const FormulaTypeSchema = z.enum(['DAY', 'EVENING', 'ALL']);

const FormulaInputSchema = z.object({
  type: FormulaTypeSchema,
  name: z.string(),
  disabledForCols: z.array(z.string().length(1)),
});

const AggregatorSchema = z.object({
  functionIndexes: z.array(z.number()).max(30),
  header: z.string().max(100),
});

const SummaryInputSchema = z.object({
  startCell: z.optional(z.string().max(5)),
  aggregators: z.array(AggregatorSchema),
});

const ConfigsInputSchema = z.object({
  days: z.optional(z.number()),
  formulas: z.optional(z.array(FormulaInputSchema)),
  startHeader: z.optional(z.string().max(50)),
  endHeader: z.optional(z.string().max(50)),
  summary: z.optional(SummaryInputSchema),
  locale: z.optional(z.string().max(20)),
});

const RequestBodySchema = z.object({
  year: z.number().int().gt(new Date().getFullYear() - 1).lt(2038),
  month: z.number().gt(-1).lt(12),
  names: z.array(z.string()),
  config: z.optional(ConfigsInputSchema),
});

type RequestBody = z.infer<typeof RequestBodySchema>;

type ConfigsInput = z.infer<typeof ConfigsInputSchema>;

type FormulaType = z.infer<typeof FormulaTypeSchema>;

type FormulaInput = z.infer<typeof FormulaInputSchema>;

type SummaryInput = z.infer<typeof SummaryInputSchema>;

type Aggregator = z.infer<typeof AggregatorSchema>;

export {
  RequestBodySchema, RequestBody, ConfigsInput, FormulaType, FormulaInput, SummaryInput, Aggregator,
};
