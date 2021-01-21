import { useEffect, useState } from 'react';
import { readStatus } from '../../services/Controllers';

const Status = args => {
    const [status, setStatus] = useState({});

    useEffect(() => {
        readStatus((updatedStatus) => {
            setStatus(updatedStatus);
        })
    }, []);

    return (
        <p>
            {status.startedAt} | {status.root}
        </p>
    )
}
export default Status;