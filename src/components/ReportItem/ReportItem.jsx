import { InputTextarea } from 'primereact/inputtextarea';
import React, { useState } from 'react';
import URLS from '../../constants/api-urls';
import httpService from '../../services/httpservice';
import miscService from '../../services/miscService';
import userService from '../../services/userservice';

export default function ReportItem({ type, id, onClose }) {

    const [description, setDescription] = useState('');

    const submitReport = (e) => {
        if (e) {
            e.preventDefault();
        }

        if (!description) {
            miscService.handleError('Please Give Brief Description');
            return;
        }

        const data = {
            type,
            description,
            reportedBy: userService.getCurrentUserId(),
        }

        if (type === 'P') {
            data.reportedPost = id;
        } else if (type === 'U') {
            data.reportedUser = id;
        } else if (type === 'J') {
            data.reportedJob = id;
        }

        httpService.postRequest(URLS.REPORT, data).subscribe(() => {
            onClose();
        })
    }

    return (

        <div className="report-component">
            <div className="form-group">
                <label>
                    Please describe briefly why you want to report this item
                </label>

                <InputTextarea
                    rows={5}
                    className="form-control single-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className="row">
                <div className="col-md-2">

                </div>

                <div className="col-md-4">
                    <button onClick={onClose} className="btn fw btn-cancel btn-secondary">
                        Cancel
                    </button>
                </div>
                <div className="col-md-6">
                    <button onClick={submitReport} className="btn fw btn-submit btn-primary">
                        Submit Report
                    </button>
                </div>

            </div>
        </div>
    )
}
