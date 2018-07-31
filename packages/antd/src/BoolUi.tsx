import { observer } from 'mobx-react';
import * as React from 'react';
import { Checkbox, Form } from 'antd';
import { CheckboxProps } from 'antd/lib/checkbox';
import { labelWithHelp, BindUiProps, parseProps } from './BindUi';
import { Bool } from '@moxb/moxb';
import { FormItemProps } from 'antd/lib/form/FormItem';

const FormItem = Form.Item;

@observer
export class BoolUi extends React.Component<BindUiProps<Bool> & CheckboxProps> {
    render() {
        const { operation, invisible, children, label, ...props } = parseProps(this.props, this.props.operation);
        if (invisible) {
            return null;
        }
        // a null value renders the checkbox in intermediate state!
        const indeterminate = operation.value == null;
        return (
            <Checkbox
                checked={operation.value}
                onChange={() => operation.toggle()}
                indeterminate={indeterminate}
                {...props}
            >
                {children}
                {labelWithHelp(label != null ? label : operation.label, operation.help)}
            </Checkbox>
        );
    }
}

@observer
export class BoolFormUi extends React.Component<BindUiProps<Bool> & FormItemProps & CheckboxProps> {
    render() {
        return (
            <FormItem>
                <BoolUi operation={this.props.operation} />
            </FormItem>
        );
    }
}
