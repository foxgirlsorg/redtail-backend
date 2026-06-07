export default ({ env }: { env: any }) => ({

    email: {
        config: {
            provider: 'nodemailer',
            providerOptions: {
                host:   env('SMTP_HOST'),
                port:   env.int('SMTP_PORT', 465),
                secure: env.bool('SMTP_SECURE', true),
                auth: {
                    user: env('SMTP_USERNAME'),
                    pass: env('SMTP_PASSWORD'),
                },
            },
            settings: {
                defaultFrom:    `${env('SMTP_FROM_NAME', 'RedTail')} <${env('SMTP_FROM')}>`,
                defaultReplyTo: env('SMTP_FROM'),
            },
        },
    },

    comments: {
        enabled: true,
        config: {
            enabledCollections: [
                'api::article.article',
                'api::manga-title.manga-title',
                'api::manga-page.manga-page',
                'api::book-title.book-title',
                'api::book-chapter.book-chapter',
            ],
            nestingEnabled: true,
            ratingsEnabled: true,
            badWords: false,
        },
    },

    'users-permissions': {
        config: {
            resetPasswordPage: `${env('PUBLIC_URL', 'https://redtail.foxgirls.org')}/auth/reset-password`,
            callbackUrl: `${env('PUBLIC_URL', 'https://redtail.foxgirls.org')}/auth/oauth-callback`,
            jwt: {
                expiresIn: '30d',
            },
        },
    },

});
