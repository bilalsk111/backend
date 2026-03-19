import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

export async function register(req, res) {
    try {
        const { username, email, password } = req.body;

        const existingUser = await userModel.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ success: false, message: "This email is already registered." });
            }
            if (existingUser.username === username) {
                return res.status(400).json({ success: false, message: "This username is already taken." });
            }
        }

        const user = await userModel.create({ username, email, password });

        const emailVerificationToken = jwt.sign({
            email: user.email,
        }, process.env.JWT_TOKEN, { expiresIn: '1d' }); 

        await sendEmail({
            to: email,
            subject: "Welcome to Perplexity!",
            html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                <p>Please verify your email address by clicking the link below:</p>
                <a href="http://localhost:3000/api/auth/verify?token=${emailVerificationToken}">Verify Email</a>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>The Perplexity Team</p>
            `
        });

        res.status(201).json({
            message: "User registered successfully.",
            success: true, 
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error during registration." });
    }
}

export async function login(req, res) {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "Invalid email or password", success: false });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
        return res.status(400).json({ message: "Invalid email or password", success: false });
    }

    if (!user.verified) {
        return res.status(400).json({ message: "Please verify your email before logging in", success: false });
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username,
    }, process.env.JWT_TOKEN, { expiresIn: '7d' });

    res.cookie("token", token);

    res.status(200).json({
        message: "Login successful",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}

export async function getMe(req, res) {
    const userId = req.user.id;
    const user = await userModel.findById(userId).select("-password");

    if (!user) {
        return res.status(404).json({ message: "User not found", success: false });
    }

    res.status(200).json({ message: "User details fetched successfully", success: true, user });
}

export async function verifyEmail(req, res) {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            return res.status(400).json({ message: "Invalid token", success: false });
        }

        user.verified = true;
        await user.save();
        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Verified</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                    body { background-color: #050505; color: #f4f4f5; margin: 0; }
                </style>
            </head>
            <body class="min-h-screen flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
                <div class="absolute top-[-5%] right-[-5%] w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-[#31b8c6]/15 blur-[80px] sm:blur-[120px] -z-10"></div>
                <div class="absolute bottom-[-5%] left-[-5%] w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-[#31b8c6]/10 blur-[80px] sm:blur-[120px] -z-10"></div>

                <div class="max-w-md w-full rounded-2xl border border-white/10 bg-zinc-900/60 p-6 sm:p-8 shadow-2xl backdrop-blur-md text-center z-10 relative">
                    
                    <div class="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-green-500/10 mb-5 sm:mb-6 border border-green-500/30">
                        <svg class="w-7 h-7 sm:w-8 sm:h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    
                    <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2 sm:mb-3">Verified Successfully!</h1>
                    <p class="text-zinc-400 text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed">
                        Your email address has been successfully verified. You are now ready to access your account and explore the dashboard.
                    </p>
                    
                    <a href="http://localhost:5173/login" 
                       class="inline-flex w-full items-center justify-center rounded-xl bg-[#31b8c6] px-4 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-zinc-950 transition-all hover:bg-[#45c7d4] active:scale-[0.98]">
                        Continue to Login
                    </a>
                </div>
            </body>
            </html>
        `;

        return res.send(html);
    } catch (err) {
        
        const errorHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verification Failed</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <style>body{background:#050505;color:white; margin:0;}</style>
            </head>
            <body class="min-h-screen flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
                <div class="absolute top-[-5%] right-[-5%] w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-red-500/10 blur-[80px] sm:blur-[120px] -z-10"></div>
                
                <div class="max-w-md w-full rounded-2xl border border-red-500/20 bg-zinc-900/60 p-6 sm:p-8 text-center shadow-2xl backdrop-blur-md z-10 relative">
                    <div class="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-red-500/10 mb-5 sm:mb-6 border border-red-500/30">
                        <svg class="w-7 h-7 sm:w-8 sm:h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </div>
                    <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">Verification Failed</h1>
                    <p class="text-zinc-400 text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed">Your verification link is invalid or has expired. Please try registering again to get a new link.</p>
                    <a href="http://localhost:5173/register" class="inline-block w-full rounded-xl border border-zinc-700 bg-transparent px-4 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-zinc-300 transition-all hover:bg-zinc-800 hover:text-white">Back to Register</a>
                </div>
            </body>
            </html>
        `;
        return res.status(400).send(errorHtml);
    }
}