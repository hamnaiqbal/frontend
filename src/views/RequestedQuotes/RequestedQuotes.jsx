import { confirmPopup } from 'primereact/confirmpopup';
import { Dialog } from 'primereact/dialog';
import { useEffect, useState } from 'react';
import RequestQuote from '../../components/RequestQuote/RequestQuote';
import URLS from '../../constants/api-urls';
import CONSTANTS from '../../constants/constants';
import httpService from '../../services/httpservice';
import miscService from '../../services/miscService';
import userService from '../../services/userservice';

export default function RequestedQuotes() {

    // Quote By User Means that the quotes that the User has requested
    const [quotesByUser, setQuotesByUser] = useState([]);

    // Quote For User Means that the quotes that the quotes that others have requested from user
    const [quotesForUser, setQuotesForUser] = useState([]);

    const [showEditDialog, setShowEditDialog] = useState(false);
    const [quoteToEdit, setQuoteToEdit] = useState({});

    const subscriptions = [];

    const getDurationLabel = (durValue) => {
        return CONSTANTS.DURATION_OPTIONS?.find(d => d.value === durValue)?.label ?? '';
    }

    useEffect(() => {
        fetchQuotes();

        return () => {
            subscriptions.forEach(sub => {
                sub.unsubscribe();
            })
        }
    }, [])

    const fetchQuotes = () => {

        const quoteByUserData = { requestedBy: userService.getCurrentUserId() }
        const quoteByUserSub = httpService.getRequest(URLS.QUOTE, quoteByUserData).subscribe(d => {
            setQuotesByUser(d);
        })

        const quoteForUserData = { requestedTo: userService.getCurrentUserId() }
        const quoteForUserSub = httpService.getRequest(URLS.QUOTE, quoteForUserData).subscribe(d => {
            setQuotesForUser(d);
        })

        subscriptions.push(quoteByUserSub, quoteForUserSub);
    }

    const deleteQuoteWarning = (event, quote) => {
        const id = quote?._id;
        if (id) {
            confirmPopup({
                target: event.currentTarget,
                message: 'Are you sure you want to delete this quote?',
                icon: 'pi pi-exclamation-triangle',
                accept: () => deleteQuote(id)
            });
        }
    }

    const deleteQuote = (id) => {
        httpService.deleteRequest(URLS.QUOTE, { _id: id }, false).subscribe(() => {
            fetchQuotes();
        });
    }

    const viewEditDialog = (quote) => {
        setQuoteToEdit(quote);
        setShowEditDialog(true);
    }
    
    const onEditDialogClose = () => {
        setShowEditDialog(false);
        fetchQuotes();
    }

    // isForUser will tell if the quote is requested by another
    // user, it will allow the current user to enter the quote amount
    const QuoteTable = ({ quotes, isForUser }) => {

        return (
            <div className="requsted-quote-card-wrapper text-left">
                <div className="requested-quote-card app-card row">
                    <div className="card-heading">
                        {isForUser &&
                            <div>
                                <p className="card-heading-text">
                                    Quote Requests For User
                                </p>
                            </div>
                        }
                        {!isForUser &&
                            <div>
                                <p className="card-heading-text">
                                    Quote Requests By User
                                </p>
                            </div>
                        }
                    </div>
                    <table>
                        <thead className="quote-table-head">
                            <tr>

                                <th className="table-head-cell">
                                    {isForUser ? 'Sent By' : 'Sent To'}
                                </th>
                                <th className="table-head-cell">
                                    Subject
                                </th>
                                <th className="table-head-cell">
                                    Date
                                </th>
                                <th className="table-head-cell text-center">
                                    Duration
                                </th>
                                <th className="table-head-cell text-center">
                                    Status
                                </th>
                                <th className="table-head-cell text-center">
                                    Amount
                                </th>
                                <th className="table-head-cell">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="quote-table-body">

                            {quotes?.length > 0 &&
                                quotes.map((quote, i) => <tr className="quote-row" key={i}>
                                    <td>
                                        {isForUser ? quote?.requestedBy?.name : quote?.requestedTo?.name}
                                    </td>

                                    <td>
                                        {quote?.course?.name}
                                        <div className="quote-description">
                                            <small> <i className="fas fa-sticky-note"></i> {quote.description}</small>
                                        </div>
                                    </td>

                                    <td>
                                        {miscService.getFormattedDate(quote?.requestedOn, true)}
                                    </td>

                                    <td className="text-center">
                                        <div className="duration-wrapper">
                                            <div>
                                                <i className="far fa-clock"></i>
                                            </div>
                                            {getDurationLabel(quote.duration)}
                                        </div>
                                    </td>

                                    <td>
                                        <div className={"quote-status status-" + quote?.status}>
                                            <i className={CONSTANTS.QUOTE_STATUSES[quote?.status].icon}></i> {CONSTANTS.QUOTE_STATUSES[quote?.status].name}
                                        </div>
                                    </td>

                                    <td className="text-center price-column">
                                        {quote.amount || 'N/A'}
                                    </td>

                                    <td className="quote-actions text-center">
                                        {
                                            // User can Edit or remove the quote description
                                            !isForUser &&
                                            <div className="btn-group" role="group" aria-label="Actions">
                                                <button onClick={() => { viewEditDialog(quote) }} type="button" className="btn btn-sm btn-outline-primary"><i className="fas fa-pencil-alt"></i></button>
                                                <button onClick={(e) => { deleteQuoteWarning(e, quote) }} type="button" className="btn btn-sm btn-outline-danger"><i className="fas fa-trash-alt"></i></button>
                                            </div>
                                        }

                                        {
                                            // User can Edit or remove the quote description
                                            isForUser &&
                                            <div className="btn-group" role="group" aria-label="Actions">
                                                <button type="button" className="btn btn-sm btn-outline-success"><i className="fas fa-check"></i></button>
                                                <button type="button" className="btn btn-sm btn-outline-danger"><i className="fas fa-times"></i></button>
                                            </div>
                                        }
                                    </td>

                                </tr>
                                )
                            }
                            {quotes?.length === 0 &&
                                <tr>
                                    <td colSpan={4}>
                                        No Records Found
                                    </td>
                                </tr>
                            }

                        </tbody>

                    </table>
                </div>
            </div>
        )
    }

    return (
        <div className="requested-quote-component">

            {/* QUOTES BY THE USER */}
            <QuoteTable quotes={quotesByUser} isForUser={false} />


            {/* QUOTES FOR THE USER */}
            <QuoteTable quotes={quotesForUser} isForUser={true} />


            {/* MODAL TO EDIT QUOTE */}
            <Dialog className="quote-dialog" header="Edit Quote Details" visible={showEditDialog} onHide={() => { setShowEditDialog(false) }} >
                <RequestQuote quoteToEdit={quoteToEdit} onClose={() => { onEditDialogClose() }} />
            </Dialog>


        </div>
    )
}
