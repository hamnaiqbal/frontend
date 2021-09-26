import { Dropdown } from 'primereact/dropdown';
import { useEffect, useState } from 'react';
import ScholarshipComponent from '../../components/ScholarshipComponent/ScholarshipComponent';
import URLS from '../../constants/api-urls';
import httpService from '../../services/httpservice';

function ScholarshipFeed() {
    const [scholarships, setScholarships] = useState([]);

    const [countriesOptions, setCountriesOptions] = useState([]);
    const [countrySelected, setCountrySelected] = useState(null);

    const [levelsOptions, setLevelsOptions] = useState([]);
    const [levelSelected, setLevelSelected] = useState(null);

    const fetchScholarships = () => {
        const params = {};
        if (countrySelected) {
            params.country = countrySelected;
        }
        if (levelSelected) {
            params.level = levelSelected;
        }

        httpService.getRequest(URLS.INTERNATIONAL_SCHOLARSHIPS, params).subscribe((data) => {
            setScholarships(data.scholarships);
            if (data.countries) {
                const cOptions = data.countries.map((c) => {
                    return { label: c, value: c.toLowerCase().split(' ').join('-') };
                });
                setCountriesOptions(cOptions);
            }
            if (data.levels) {
                const lOptions = data.levels.map((l) => {
                    return { label: l, value: l.toLowerCase() };
                });
                setLevelsOptions(lOptions);
            }
        });
    };

    useEffect(() => {
        fetchScholarships();
    }, []);

    const listScholarships = () => {
        return scholarships.map((sc, index) => {
            return (
                <a href={sc.href} target="_blank" className="scholarship-anchor" rel="noreferrer">
                    <ScholarshipComponent key={index} scholarship={sc}></ScholarshipComponent>
                </a>
            );
        });
    };

    return (
        <div className="scholarship-component">
            <div className="row">
                <div className="col-md-8">{listScholarships()}</div>
                <div className="col-md-4">
                    <div className="scholarship-filter-card">
                        <div className="country-filter single-sc-filter">
                            <div className="card-heading-wrapepr">
                                <p className="card-heading">Filter Scholarships</p>
                            </div>
                            <hr />
                            <div className="filter-form">
                                <div className="form-group p-float-label">
                                    <Dropdown
                                        id="countries-filter"
                                        value={countrySelected}
                                        onChange={(e) => {
                                            setCountrySelected(e.value);
                                        }}
                                        showClear
                                        filter
                                        options={countriesOptions}
                                    ></Dropdown>
                                    <label htmlFor="countries-filter">Filter by Country</label>
                                </div>
                                <div className="form-group p-float-label">
                                    <Dropdown
                                        id="levels-filter"
                                        value={levelSelected}
                                        onChange={(e) => {
                                            setLevelSelected(e.value);
                                        }}
                                        showClear
                                        filter
                                        options={levelsOptions}
                                    ></Dropdown>
                                    <label htmlFor="levels-filter">Filter by Level</label>
                                </div>
                                <div className="form-group">
                                    <button className="form-control primary-button" onClick={fetchScholarships}>
                                        Filter Results
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ScholarshipFeed;
