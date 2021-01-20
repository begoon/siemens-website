import { useState } from 'react';
import * as api from '../services/Controllers';
import { VariableRow, NewVariableRow } from './Variable';

const Controllers = (args) => {
  const [updatingVariable, setUpdatingVariable] = useState(null);
  const [variables, setVariables] = useState({ ...args.variables });
  const [newVariable, setNewVariable] = useState({ name: '', value: '' });
  const controller = args.controller;

  const updateVariable = (variableName, event) => {
    let updatedVariables = { ...variables };
    updatedVariables[variableName] = event.target.value;
    setVariables(updatedVariables);
  };

  const updateNewVariable = (event, field) => {
    const updatedNewVariable = { ...newVariable };
    updatedNewVariable[field] = event.target.value;
    setNewVariable(updatedNewVariable);
  }

  const saveVariable = (id, name, value, isNew) => {
    if (updatingVariable || !name) return;
    setUpdatingVariable(id);
    api.saveVariable(controller, name, value, () => {
      const updatedVariables = { ...variables };
      updatedVariables[name] = value;
      setVariables(updatedVariables);
      if (isNew) setNewVariable({ name: '', value: '' });
    }, () => {
      setUpdatingVariable(null);
    });
  };

  const deleteVariable = (id, name) => {
    if (updatingVariable) return;
    setUpdatingVariable(id);
    api.deleteVariable(controller, name, () => {
      const updatedVariables = { ...variables };
      delete updatedVariables[name];
      setVariables(updatedVariables);
    }, () => {
      setUpdatingVariable(null);
    });
  };

  const buildVariableRow = (name) => {
    if (!name) return;
    const id = `${controller}-${name}`;
    const value = variables[name];
    return (
      <VariableRow
        key={id}
        name={name}
        value={value}
        updating={updatingVariable === id}
        update={(event) => updateVariable(name, event)}
        save={() => saveVariable(id, name, value)}
        delete={(event) => deleteVariable(id, name, event)}
      />
    );
  }

  const buildNewVariableRow = () => {
    const id = `${controller}@new_variable`;
    const name = newVariable.name;
    const value = newVariable.value;
    return (
      <NewVariableRow
        key={id}
        name={name}
        value={value}
        updating={updatingVariable === id}
        save={() => saveVariable(id, name, value, true)}
        updateName={(event) => updateNewVariable(event, 'name')}
        updateValue={(event) => updateNewVariable(event, 'value')}
      />
    );
  }

  return (
    <>
      <h1>{controller}</h1>
      <table className="pure-table">
        <thead>
          <tr>
            <td>Variable</td>
            <td>Value</td>
            <td>Save</td>
            <td>Delete</td>
          </tr>
        </thead>
        <tbody>
          {
            Object.keys(variables).map((variable) => buildVariableRow(variable))
          }
          {
            buildNewVariableRow()
          }
        </tbody>
      </table>
    </>
  );
}

export default Controllers;
