import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Customers from '../components/Customers';
import api from '../api'; // Mock the API
import { OrbitProgress } from 'react-loading-indicators';

// Mocking the custom hook `useCustomers`
jest.mock('../hooks/clients', () => ({
    __esModule: true,
    default: () => ({
        customers: [
            { _id: '1', name: 'John Doe', phoneNumber: '998901234567', region: 'Tashkent', discountRate: 0.1 },
            { _id: '2', name: 'Jane Smith', phoneNumber: '998901234568', region: 'Samarkand', discountRate: 0.2 },
        ],
        loading: false,
        error: null,
        refreshCustomers: jest.fn(),
    }),
}));

// Mocking the API calls
jest.mock('../api', () => ({
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
}));

describe('Customers Component', () => {
    test('renders customer list', () => {
        render(<Customers />);

        // Check if customer names are rendered
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    test('opens the add customer form when "Yangi Mijoz" button is clicked', () => {
        render(<Customers />);

        // Click the "Yangi Mijoz" button
        fireEvent.click(screen.getByText('Yangi Mijoz'));

        // Check if the form is visible
        expect(screen.getByText('Yangi Mijoz Qo\'shish')).toBeInTheDocument();
    });

    test('opens the edit customer form when edit button is clicked', () => {
        render(<Customers />);

        // Click the edit button of the first customer
        fireEvent.click(screen.getAllByRole('button', { name: /edit/i })[0]);

        // Check if the form is visible and if it's for editing
        expect(screen.getByText('Mijozni Tahrirlash')).toBeInTheDocument();
    });

    test('deletes a customer when delete button is clicked', async () => {
        render(<Customers />);

        // Mock the API delete call
        api.delete.mockResolvedValueOnce({});

        // Click the delete button of the first customer
        fireEvent.click(screen.getAllByRole('button', { name: /o'chirish/i })[0]);

        // Wait for the API call to complete and verify the refreshCustomers function is called
        await waitFor(() => expect(api.delete).toHaveBeenCalledWith('/customers/1'));
    });

    test('shows loading indicator when loading is true', () => {
        // Mock the hook to return loading state
        jest.mock('../hooks/clients', () => ({
            __esModule: true,
            default: () => ({
                customers: [],
                loading: true,
                error: null,
                refreshCustomers: jest.fn(),
            }),
        }));

        render(<Customers />);

        // Check if loading spinner is shown
        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    test('shows error message when there is an error', () => {
        // Mock the hook to return an error
        jest.mock('../hooks/clients', () => ({
            __esModule: true,
            default: () => ({
                customers: [],
                loading: false,
                error: 'Failed to load customers',
                refreshCustomers: jest.fn(),
            }),
        }));

        render(<Customers />);

        // Check if error message is shown
        expect(screen.getByText('Failed to load customers')).toBeInTheDocument();
    });
});
