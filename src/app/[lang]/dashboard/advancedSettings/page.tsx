"use client";
import { useTranslation } from "@/context/translation-context";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import getAuthHeaders from "../Shared/getAuth";
import FormField from "../Shared/FormField";

interface Setting {
    id: number;
    key: string;
    label: string;
    value: string;
    field: 'text' | 'boolean';
}

export default function AdvancedSettings() {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [settings, setSettings] = useState<Setting[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const translations = useTranslation();
    
    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = () => {
        axios.get(`${apiUrl}/settings`, { headers: getAuthHeaders() })
            .then((response) => {
                setSettings(response.data.result);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching settings:", error);
                setIsLoading(false);
            });
    };

    const initialValues = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.field === 'boolean' 
            ? setting.value.toLowerCase() === 'true' ? 'true' : 'false'
            : setting.value;
        return acc;
    }, {} as Record<string, any>);

    const handleSubmit = (values: Record<string, any>) => {
        axios.post(`${apiUrl}/settings/update`, values, { headers: getAuthHeaders() })
            .then(() => {
                toast.success('Settings updated successfully');
                fetchSettings(); 
            })
            .catch((error) => {
                console.error('Update failed:', error.response?.data);
                toast.error('Update failed. Please check console for details.');
            });
    };

    if (isLoading) {
        return <div className="text-white p-4">{translations.storeDetails.loading}</div>;
    }

    return (
        <div className="flex flex-1 flex-col gap-2 text-white">
            <Toaster position="top-right" />
            <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, dirty }) => (
                    <Form>
                        <div className="px-8 py-4 w-full bg-neutral-900 rounded-[18px] mb-4">
                            <h2 className="text-2xl mb-4">{translations.sidebar.advancedSettings}</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {settings.map((setting) => (
                                    <div key={setting.id} className="col-span-1">
                                   
                                        <label className="block text-sm font-medium mb-2">
                                            {setting.label}
                                        </label>
                                        {setting.field === 'boolean' ? (
                                            <Field
                                                as="select"
                                                name={setting.key}
                                                className="px-4 py-2 rounded-lg w-full bg-[#444444] text-sm h-12 border !border-white/10"
                                            >
                                                <option value="true">{translations.settings.enabled}</option>
                                                <option value="false">{translations.settings.disabled}</option>
                                            </Field>
                                        ) : (
                                            <Field
                                                type="text"
                                                name={setting.key}
                                                className="w-full bg-[#444] border border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-[#53B4AB]"
                                            />
                                        )}
                                        <ErrorMessage 
                                            name={setting.key} 
                                            component="div" 
                                            className="text-red-500 text-sm mt-1" 
                                        />
                                    </div>
                                ))}
                            </div>
                            <button
                                type="submit"
                                disabled={!dirty || isSubmitting}
                                className="mt-6 px-6 py-2 bg-[#53B4AB] hover:bg-[#3a807a] text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? translations.storeUpdate.form.buttons.saving : translations.storeUpdate.form.buttons.saveSettings}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}