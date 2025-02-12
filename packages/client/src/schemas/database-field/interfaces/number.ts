import { defaultProps } from './properties';
import { FieldOptions } from '.';

export const number: FieldOptions = {
  name: 'number',
  type: 'object',
  group: 'basic',
  order: 5,
  title: '{{t("Number")}}',
  sortable: true,
  default: {
    dataType: 'float',
    // name,
    uiSchema: {
      type: 'number',
      // title,
      'x-component': 'InputNumber',
      'x-component-props': {
        stringMode: true,
        step: '0',
      },
      'x-decorator': 'FormItem',
      'x-designable-bar': 'InputNumber.DesignableBar',
    },
  },
  properties: {
    ...defaultProps,
    'uiSchema.x-component-props.step': {
      type: 'string',
      title: '{{t("Precision")}}',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      default: '0',
      enum: [
        { value: '0', label: '1' },
        { value: '0.1', label: '1.0' },
        { value: '0.01', label: '1.00' },
        { value: '0.001', label: '1.000' },
        { value: '0.0001', label: '1.0000' },
        { value: '0.00001', label: '1.00000' },
      ],
    },
  },
  operations: [
    { label: '{{t("=")}}', value: 'eq', selected: true },
    { label: '{{t("≠")}}', value: 'ne' },
    { label: '{{t(">")}}', value: 'gt' },
    { label: '{{t("≥")}}', value: 'gte' },
    { label: '{{t("<")}}', value: 'lt' },
    { label: '{{t("≤")}}', value: 'lte' },
    // {label: '介于', value: 'between'},
    { label: '{{t("is empty")}}', value: '$null', noValue: true },
    { label: '{{t("is not empty")}}', value: '$notNull', noValue: true },
  ],
};
