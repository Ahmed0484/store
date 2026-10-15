import { useForm, useWatch, type FieldValues } from "react-hook-form";
import { createProductSchema, type CreateProductSchema } from "../../lib/schemas/createProductSchema";
import { useFetchFiltersQuery } from "../catalog/catalogApi";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod"
import AppTextInput from "../../app/shared/components/AppTextInput";
import AppSelectInput from "../../app/shared/components/AppSelectInput";
import AppDropzone from "../../app/shared/components/AppDropzone";

import { z } from "zod";
import type { Product } from "../../app/models/product";
import { useEffect } from "react";
import { useCreateProductMutation, useUpdateProductMutation } from "./adminApi";
import { handleApiError } from "../../lib/util";

// Extract the exact Raw Input Type from your Zod Schema
type CreateProductInput = z.input<typeof createProductSchema>;

type Props = {
    setEditMode: (value: boolean) => void
    product: Product | null
    refetch: () => void
    setSelectedProduct: (value: Product | null) => void
}


export default function ProductForm({ setEditMode, product, refetch, setSelectedProduct }: Props) {
    const { control, handleSubmit, reset, setError, formState: { isSubmitting } } =
        useForm<CreateProductInput, unknown, CreateProductSchema>({
            mode: 'onTouched',
            resolver: zodResolver(createProductSchema)
        })
    const watchFile = useWatch({
        control,
        name: 'file'
    });
    const { data } = useFetchFiltersQuery();

    const [createProduct] = useCreateProductMutation();
    const [updateProduct] = useUpdateProductMutation();

    // useEffect(() => {
    //     if (product) reset(product);

    //     return () => {
    //         if (watchFile && 'preview' in watchFile) {
    //             URL.revokeObjectURL((watchFile as Record<string, unknown>).preview as string);
    //         }
    //     }
    // }, [product, reset, watchFile]);

    // 1. First useEffect: Handle setting the product data ONLY when the product changes
    useEffect(() => {
        if (product) reset(product);
    }, [product, reset]);

    // 2. Second useEffect: Handle cleanup ONLY when the watched file is swapped out or unmounted
    useEffect(() => {
        return () => {
            if (watchFile && typeof watchFile === 'object' && 'preview' in watchFile) {
                URL.revokeObjectURL((watchFile as Record<string, unknown>).preview as string);
            }
        };
    }, [watchFile]);
    const createFormData = (items: FieldValues) => {
        const formData = new FormData();
        for (const key in items) {
            formData.append(key, items[key])
        }

        return formData;
    }
    const onSubmit = async (data: CreateProductSchema) => {
        try {
            const formData = createFormData(data);
            if (watchFile) formData.append('file', watchFile);
            if (product) await updateProduct({id: product.id, data: formData}).unwrap();
            else await createProduct(formData).unwrap();
            setEditMode(false);
            setSelectedProduct(null);
            refetch();
        } catch (error) {
            console.log(error);
            handleApiError<CreateProductSchema>(error, setError,
                ['brand', 'description', 'file', 'name', 'pictureUrl',
                    'price', 'quantityInStock', 'type']);
        }
    }

    return (
        <Box component={Paper} sx={{ p: 4, maxWidth: 'lg', mx: 'auto' }}>
            <Typography variant="h4" sx={{ mb: 4 }}>
                Product details
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    <Grid size={12}>
                        <AppTextInput control={control} name="name" label='Product name' />
                    </Grid>
                    <Grid size={6}>
                        {data?.brands &&
                            <AppSelectInput
                                items={data.brands}
                                control={control}
                                name="brand"
                                label='Brand' />}
                    </Grid>
                    <Grid size={6}>
                        {data?.brands &&
                            <AppSelectInput
                                items={data.types}
                                control={control}
                                name="type"
                                label='Type' />}
                    </Grid>
                    <Grid size={6}>
                        <AppTextInput type="number" control={control} name="price"
                            label='Price in cents' />
                    </Grid>
                    <Grid size={6}>
                        <AppTextInput type='number' control={control} name="quantityInStock" label='Quantity in stock' />
                    </Grid>
                    <Grid size={12}>
                        <AppTextInput
                            control={control}
                            multiline
                            rows={4}
                            name="description"
                            label='Description' />
                    </Grid>
                    <Grid size={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <AppDropzone name="file" control={control} />
                        {watchFile ? (
                            <img
                                src={'preview' in watchFile ?
                                    (watchFile as Record<string, unknown>).preview as string :
                                    URL.createObjectURL(watchFile as File)
                                }
                                alt='preview of image'
                                style={{ maxHeight: 200 }} />
                        ) : product?.pictureUrl ? (
                            <img src={product.pictureUrl} alt='preview of image'
                                style={{ maxHeight: 200 }} />
                        ) : null}

                    </Grid>
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={() => setEditMode(false)} variant="contained" color='inherit'>Cancel</Button>
                    <Button loading={isSubmitting} variant="contained" type="submit" color='success'>
                        Submit
                    </Button>
                </Box>
            </form>
        </Box>
    )
}