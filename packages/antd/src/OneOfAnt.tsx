import { observer } from 'mobx-react';
import * as React from 'react';
import { Select, Radio, Form } from 'antd';
import { SelectProps } from 'antd/lib/select';
import { RadioProps } from 'antd/lib/radio';
import { BindAntProps, labelWithHelp, parseProps } from './BindAnt';
import { OneOf } from '@moxb/moxb';
import { FormItemProps } from 'antd/lib/form/FormItem';

@observer
export class OneOfAnt extends React.Component<BindAntProps<OneOf> & RadioProps> {
    render() {
        const { operation, invisible, ...props } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <Radio.Group onChange={e => operation.setValue(e.target.value)} {...props}>
                {operation.choices.map(opt => (
                    <Radio key={opt.value} value={opt.value} checked={opt.value === operation.value}>
                        {opt.label}
                    </Radio>
                ))}
            </Radio.Group>
        );
    }
}

@observer
export class OneOfFormAnt extends React.Component<BindAntProps<OneOf> & RadioProps & FormItemProps> {
    render() {
        const { operation, label, invisible } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <Form.Item
                label={labelWithHelp(label != null ? label : operation.label, operation.help)}
                hasFeedback={operation.errors != null}
                validateStatus={operation.errors != null ? 'error' : undefined}
            >
                <OneOfAnt operation={operation} />
            </Form.Item>
        );
    }
}

@observer
export class OneOfSelectAnt extends React.Component<BindAntProps<OneOf> & SelectProps> {
    render() {
        const { operation, invisible, value, placeholder, ...props } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <Select
                onChange={(selectionValue: any) => operation.setValue(selectionValue)}
                value={this.props.operation.value || ''}
                placeholder={placeholder}
                mode="default"
                {...props}
            >
                {operation.choices.map(opt => (
                    <Select.Option key={opt.value} value={opt.value}>
                        {opt.label}
                    </Select.Option>
                ))}
            </Select>
        );
    }
}

@observer
export class OneOfSelectFormAnt extends React.Component<BindAntProps<OneOf> & RadioProps & FormItemProps> {
    render() {
        const { operation, label, invisible, labelCol, wrapperCol, ...props } = parseProps(
            this.props,
            this.props.operation
        );
        if (invisible) {
            return null;
        }
        return (
            <Form.Item
                label={labelWithHelp(label != null ? label : operation.label, operation.help)}
                labelCol={labelCol}
                wrapperCol={wrapperCol}
                hasFeedback={operation.errors != null}
                validateStatus={operation.errors != null ? 'error' : undefined}
            >
                <OneOfSelectAnt operation={operation} />
            </Form.Item>
        );
    }
}
