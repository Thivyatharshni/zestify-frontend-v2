import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cmsApi } from '../../services/dashboard/cmsApi';

const Footer = () => {
    const [footerSections, setFooterSections] = useState({});

    useEffect(() => {
        const fetchFooterData = async () => {
            try {
                const response = await cmsApi.getFooter();
                if (response.data.success && response.data.data && response.data.data.length > 0) {
                    const grouped = response.data.data.reduce((acc, item) => {
                        if (!acc[item.section]) acc[item.section] = [];
                        acc[item.section].push(item);
                        return acc;
                    }, {});
                    setFooterSections(grouped);
                }
            } catch (error) {
                console.error("Failed to fetch footer CMS");
            }
        };
        fetchFooterData();
    }, []);

    const renderLinks = (section, defaultLinks) => {
        const cmsLinks = footerSections[section];
        const linksToRender = cmsLinks && cmsLinks.length > 0 ? cmsLinks : defaultLinks;

        return (
            <ul className="space-y-5 text-gray-400 text-xl font-medium">
                {linksToRender.map((link, idx) => (
                    <li key={idx}>
                        {link.url.startsWith('http') ? (
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                {link.label}
                            </a>
                        ) : (
                            <Link to={link.url} className="hover:text-white transition-colors">
                                {link.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <footer className="bg-black text-white pt-24 pb-16">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-20">

                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                                <span className="text-white font-black text-2xl">Z</span>
                            </div>
                            <span className="text-4xl font-black tracking-tighter">Zestify</span>
                        </div>
                        <p className="text-gray-400 text-xl font-medium">
                            © 2024 Zestify Technologies Pvt. Ltd
                        </p>
                    </div>

                    <div>
                        <h3 className="font-black text-white mb-8 uppercase tracking-widest text-xl border-b border-white/10 pb-2">Company</h3>
                        {renderLinks("Company", [
                            { label: "About", url: "/about" },
                            { label: "Careers", url: "/careers" },
                            { label: "Team", url: "/team" },
                        ])}
                    </div>

                    <div>
                        <h3 className="font-black text-white mb-8 uppercase tracking-widest text-xl border-b border-white/10 pb-2">Contact</h3>
                        {renderLinks("Contact", [
                            { label: "Help & Support", url: "/help" },
                            { label: "Partner with us", url: "/partner" },
                            { label: "Ride with us", url: "/ride" },
                        ])}
                    </div>

                    <div>
                        <h3 className="font-black text-white mb-8 uppercase tracking-widest text-xl border-b border-white/10 pb-2">Legal</h3>
                        {renderLinks("Legal", [
                            { label: "Terms & Conditions", url: "/terms" },
                            { label: "Refund & Cancellation", url: "/refund" },
                            { label: "Privacy Policy", url: "/privacy" },
                            { label: "Cookie Policy", url: "/cookie" },
                        ])}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
