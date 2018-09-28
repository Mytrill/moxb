import { ManyOf } from '@moxb/moxb';
import { Form, Select, Checkbox, Row, Col } from 'antd';
import { SelectProps } from 'antd/lib/select';
import { CheckboxGroupProps } from 'antd/lib/checkbox';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { BindAntFormProps, BindAntProps, parseProps, getErrorMessages, labelWithHelp } from './BindAnt';

@observer
export class ManyOfAnt extends React.Component<BindAntProps<ManyOf> & SelectProps> {
    render() {
        const { operation, invisible, mode, children, defaultValue, placeholder, ...props } = parseProps(
            this.props,
            this.props.operation
        );
        if (invisible || operation.invisible) {
            return null;
        }
        // make sure the value is not a mobx object...
        const value = toJS(operation.value);
        return (
            <Select
                onChange={(selectionValue: any) => operation.setValue(selectionValue)}
                value={value}
                placeholder={placeholder}
                defaultValue={defaultValue}
                mode={typeof mode === 'undefined' ? 'default' : mode}
                {...props}
            >
                {operation.choices.map(opt => (
                    <Select.Option key={opt.value} value={opt.value}>
                        {opt.label}
                    </Select.Option>
                ))}
                {children}
            </Select>
        );
    }
}

@observer
export class ManyOfCheckboxAnt extends React.Component<BindAntProps<ManyOf> & CheckboxGroupProps> {
    render() {
        const { operation, invisible, children, defaultValue, ...props } = parseProps(this.props, this.props.operation);
        if (invisible || operation.invisible) {
            return null;
        }
        // make sure the value is not a mobx object...
        const value = toJS(operation.value);
        return (
            <Checkbox.Group
                onChange={(selectionValue: any) => operation.setValue(selectionValue)}
                value={value}
                defaultValue={defaultValue}
                {...props}
            >
                <Row>
                    {operation.choices.map(opt => (
                        <Col key={opt.value}>
                            <Checkbox value={opt.value}>{opt.label}</Checkbox>
                        </Col>
                    ))}
                    {children}
                </Row>
            </Checkbox.Group>
        );
    }
}

@observer
export class ManyOfFormAnt extends React.Component<BindAntFormProps & SelectProps & BindAntProps<ManyOf>> {
    render() {
        const { operation, label, help, invisible, formStyle, ...props } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        return (
            <Form.Item
                label={labelWithHelp(label != null ? label : operation.label, operation.help)}
                style={formStyle || undefined}
                required={operation.required}
                hasFeedback={operation.errors!.length > 0}
                validateStatus={operation.errors!.length > 0 ? 'error' : undefined}
                help={operation.errors!.length > 0 ? getErrorMessages(operation.errors!) : null}
            >
                <ManyOfAnt operation={operation} {...props as any} />
            </Form.Item>
        );
    }
}
