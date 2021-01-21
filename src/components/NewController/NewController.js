import classes from './NewController.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

import { createController } from '../../services/Controllers';
import { useState } from 'react';

const NewController = (args) => {
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');

  const create = () => {
    if (saving || !name) return;
    setSaving(true);
    createController(name, () => {
      args.create(name);
      setName('');
    }, () => {
      setSaving(false);
    })
  }

  const updateName = (event) => {
    setName(event.target.value.replace(/\s/g, ''));
  }

  return (
    <div className={classes.NewController}>
      <h1>Create new controller</h1>
      <div>
        <input value={name} onChange={updateName} />
        <button>
          {
            saving ?
              <FontAwesomeIcon icon={faSyncAlt} className="fa-spin" /> :
              <FontAwesomeIcon icon={faSave} onClick={create} />
          }
        </button>
      </div>
    </div>
  );
}

export default NewController;
