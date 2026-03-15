const CrimeReport = require('../models/CrimeReport');
const User = require('../models/User');

const createReport = async (req, res) => {
    try {
        const { type, description, date, time, location } = req.body;

        let evidence = null;
        if (req.file) {
            evidence = req.file.path.replace(/\\/g, "/");
        }

        const trackingId = `CR-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

        const report = await CrimeReport.create({
            type,
            description,
            date,
            time,
            location,
            evidence,
            reporterId: req.user.id,
            trackingId
        });

        res.status(201).json(report);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getReports = async (req, res) => {
    try {
        let reports;
        const includeOptions = [
            { model: User, as: 'reporter', attributes: ['username', 'email'] },
            { model: User, as: 'assignedOfficer', attributes: ['username'] }
        ];

        if (req.user.role === 'citizen') {
            reports = await CrimeReport.findAll({
                where: { reporterId: req.user.id },
                include: includeOptions
            });
        } else {
            // Police/Admin see all or assigned
            let where = {};
            if (req.query.assignedToMe === 'true') {
                where.assignedToId = req.user.id;
            }
            reports = await CrimeReport.findAll({ where, include: includeOptions });
        }

        res.json(reports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getReportById = async (req, res) => {
    try {
        const report = await CrimeReport.findByPk(req.params.id, {
            include: [
                { model: User, as: 'reporter', attributes: ['username', 'email'] },
                { model: User, as: 'assignedOfficer', attributes: ['username', 'email'] }
            ]
        });

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        if (req.user.role === 'citizen' && report.reporterId !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(report);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateReport = async (req, res) => {
    try {
        const report = await CrimeReport.findByPk(req.params.id);

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }

        const { status, remarks, assignedTo } = req.body;

        if (req.user.role === 'police') {
            report.status = status || report.status;
            report.remarks = remarks || report.remarks;
        }

        if (req.user.role === 'admin') {
            if (assignedTo) report.assignedToId = assignedTo;
            report.status = status || report.status;
            report.remarks = remarks || report.remarks;
        }

        await report.save();
        res.json(report);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getPoliceStats = async (req, res) => {
    try {
        const stats = {
            total: await CrimeReport.count(),
            pending: await CrimeReport.count({ where: { status: 'Pending' } }),
            investigating: await CrimeReport.count({ where: { status: 'Under Investigation' } }),
            closed: await CrimeReport.count({ where: { status: 'Closed' } }),
            assignedToMe: req.user.role !== 'citizen' ? await CrimeReport.count({ where: { assignedToId: req.user.id } }) : 0
        };
        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createReport, getReports, getReportById, updateReport, getPoliceStats };
