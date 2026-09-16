import { LockOutlined } from "@mui/icons-material";
import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { loginSchema, type LoginSchema } from "../../lib/schemas/loginSchema";
import { useLazyUserInfoQuery, useLoginMutation } from "./accountApi";
import { zodResolver } from "@hookform/resolvers/zod";

export default function LoginForm() {
    const [login, { isLoading }] = useLoginMutation();
    const [fetchUserInfo] = useLazyUserInfoQuery();
    const location = useLocation();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
        mode: 'onTouched',
        resolver: zodResolver(loginSchema)
    });
    const navigate = useNavigate();
    const onSubmit = async (data: LoginSchema) => {
        try {
            await login(data).unwrap();
            await fetchUserInfo();
            navigate(location.state?.from || '/catalog');
        } catch (error) {
            console.log("Login failed, staying on page:", error);
        }
    }
    return (
        <Container component={Paper} maxWidth='sm' sx={{ borderRadius: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '8' }}>
                <LockOutlined sx={{ mt: 3, color: 'secondary.main', fontSize: 40 }} />
                <Typography variant="h5">
                    Sign in
                </Typography>
                <Box component='form'
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3, marginY: 3 }} >
                    <TextField
                        {...register('email')}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        fullWidth
                        label='Email'
                        autoFocus />
                    <TextField
                        {...register('password')}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        fullWidth
                        label='Password'
                        type="password" />
                    <Button disabled={isLoading} variant="contained" type="submit">
                        Sign in
                    </Button>
                    <Typography sx={{ textAlign: 'center' }}>
                        Don't have an account?
                        <Typography sx={{ ml: 1 }} component={Link} to='/register' color='primary'>
                            Sign up
                        </Typography>
                    </Typography>
                </Box>
            </Box>
        </Container>
    )
}




