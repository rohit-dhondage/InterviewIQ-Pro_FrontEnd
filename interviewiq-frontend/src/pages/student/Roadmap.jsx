import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  Map, CheckCircle2, ChevronRight,
  Code2, Cpu, Layers, FileText, MessageSquare,
  Loader2, Play, BookOpen, Trophy, Building2,
  Sparkles, ShieldCheck, ArrowRight, Zap, Target
} from 'lucide-react'
import api from '../../api/axios'

// 11 Top MNC Company Multi-Tier Step-by-Step Progression Pathways
const COMPANY_PATHWAYS = {
  TCS: {
    name: 'TCS (Tata Consultancy Services)',
    logo: '🔵',
    badge: 'TCS Placement Ladder',
    stages: [
      {
        stage: 1,
        tier: 'TCS Ninja',
        package: '3.36 - 3.6 LPA',
        icon: Code2,
        color: 'text-blue-400',
        bg: 'bg-blue-500/15',
        border: 'border-blue-500/30',
        description: 'Foundation Aptitude & Basic Coding Round',
        rounds: ['Numerical Ability & Verbal', 'Reasoning & Pseudo Code', 'Basic Coding (Arrays/Strings)', 'Technical & HR Interview'],
        topics: [
          { id: 'tcs_n1', label: 'TCS NQT Foundation Aptitude & Quant', done: true, resources: ['Indiabix Aptitude', 'PrepInsta TCS'] },
          { id: 'tcs_n2', label: 'Pseudocode & C/C++ Fundamentals', done: true, resources: ['GeeksforGeeks C', 'TCS NQT PYQs'] },
          { id: 'tcs_n3', label: 'Basic Array & String Problems', done: true, resources: ['LeetCode Easy', 'GFG Top 50'] },
          { id: 'tcs_n4', label: 'Basic SQL Queries & DBMS Definitions', done: false, resources: ['W3Schools SQL', 'Neso Academy'] },
          { id: 'tcs_n5', label: 'TCS Ninja HR & Behavioral Practice', done: false, resources: ['InterviewIQ AI HR Room'] }
        ]
      },
      {
        stage: 2,
        tier: 'TCS Digital',
        package: '7.0 - 7.5 LPA',
        icon: Cpu,
        color: 'text-purple-400',
        bg: 'bg-purple-500/15',
        border: 'border-purple-500/30',
        description: 'Advanced Coding & Algorithmic Problem Solving',
        rounds: ['Advanced Quantitative & Reasoning', 'Advanced Coding (2 Problems - Trees, DP, Graphs)', 'Deep Technical Interview'],
        topics: [
          { id: 'tcs_d1', label: 'Advanced Data Structures (Trees, Binary Search Trees)', done: false, resources: ['NeetCode 150', 'GFG Trees'] },
          { id: 'tcs_d2', label: 'Dynamic Programming & Recursion Patterns', done: false, resources: ['Aditya Verma DP', 'LeetCode Medium'] },
          { id: 'tcs_d3', label: 'Graph Traversal (BFS & DFS)', done: false, resources: ['Striver SDE Sheet', 'CS Dojo'] },
          { id: 'tcs_d4', label: 'Advanced SQL JOINs & Subqueries', done: false, resources: ['LeetCode SQL 50'] },
          { id: 'tcs_d5', label: 'TCS Digital Technical AI Mock Interview', done: false, resources: ['InterviewIQ AI Technical'] }
        ]
      },
      {
        stage: 3,
        tier: 'TCS Prime',
        package: '9.0 - 11.5 LPA',
        icon: Layers,
        color: 'text-amber-400',
        bg: 'bg-amber-500/15',
        border: 'border-amber-500/30',
        description: 'High Performance Computing, GenAI & Cloud Architecture',
        rounds: ['Prime Coding Challenge (Hard DP / Graph Algorithms)', 'System Architecture & Design Interview', 'Leadership & Innovation Round'],
        topics: [
          { id: 'tcs_p1', label: 'System Design Fundamentals (HLD/LLD)', done: false, resources: ['Gaurav Sen YT', 'ByteByteGo'] },
          { id: 'tcs_p2', label: 'Cloud Computing & Microservices Architecture', done: false, resources: ['AWS Basics', 'Spring Boot Microservices'] },
          { id: 'tcs_p3', label: 'Generative AI & LLM Integrations', done: false, resources: ['Spring AI Docs', 'LangChain Basics'] },
          { id: 'tcs_p4', label: 'Complex Algorithmic Optimization (LeetCode Hard)', done: false, resources: ['Striver DP Sheet'] }
        ]
      }
    ]
  },

  Infosys: {
    name: 'Infosys',
    logo: '🟣',
    badge: 'Infosys Career Ladder',
    stages: [
      {
        stage: 1,
        tier: 'System Engineer (SE)',
        package: '3.6 LPA',
        icon: Code2,
        color: 'text-purple-400',
        bg: 'bg-purple-500/15',
        border: 'border-purple-500/30',
        description: 'Mathematical Ability, Reasoning & Pseudocode',
        rounds: ['Infosys Online Test (Quant, Reasoning, Verbal)', 'Pseudo Code & Puzzle Round', 'TR + HR Combined Interview'],
        topics: [
          { id: 'inf_se1', label: 'Infosys Mathematical Ability & Logical Reasoning', done: true, resources: ['PrepInsta Infosys', 'Indiabix'] },
          { id: 'inf_se2', label: 'Pseudocode Analysis & Output Finding', done: true, resources: ['GFG Pseudocode', 'Infosys PYQs'] },
          { id: 'inf_se3', label: 'Core Java / C Pseudocode & OOPs', done: true, resources: ['Neso Academy', 'Java Brains'] },
          { id: 'inf_se4', label: 'Basic DBMS & Relational SQL', done: false, resources: ['W3Schools SQL'] }
        ]
      },
      {
        stage: 2,
        tier: 'Digital Specialist Engineer (DSE)',
        package: '6.25 LPA',
        icon: Cpu,
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/15',
        border: 'border-indigo-500/30',
        description: 'Medium Level Coding & Full-Stack Tech Stack',
        rounds: ['HackWithInfy / DSE Coding Assessment', 'Data Structures & DBMS Round', 'Technical Interview'],
        topics: [
          { id: 'inf_dse1', label: 'Arrays, Strings & Searching/Sorting', done: false, resources: ['LeetCode Medium', 'Striver Sheet'] },
          { id: 'inf_dse2', label: 'Stack, Queue & Linked List Operations', done: false, resources: ['GFG Data Structures'] },
          { id: 'inf_dse3', label: 'Relational Database Schema Design & Normalization', done: false, resources: ['Gate Smashers DBMS'] },
          { id: 'inf_dse4', label: 'Web Technologies (React / Spring Boot Basics)', done: false, resources: ['InterviewIQ Roadmaps'] }
        ]
      },
      {
        stage: 3,
        tier: 'Specialist Programmer (SP)',
        package: '9.5 LPA',
        icon: Layers,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/15',
        border: 'border-emerald-500/30',
        description: 'Competitive Programming & Advanced Algorithmic Mastery',
        rounds: ['HackWithInfy National Coding Contest', 'Advanced Algorithms & Graph Theory', 'Tech Architect Discussion'],
        topics: [
          { id: 'inf_sp1', label: 'Advanced Graph Algorithms (Dijkstra, Segment Trees)', done: false, resources: ['CP Handbook', 'LeetCode Hard'] },
          { id: 'inf_sp2', label: 'Dynamic Programming with Bitmasking', done: false, resources: ['Striver DP Series'] },
          { id: 'inf_sp3', label: 'High Scalability & Distributed Systems', done: false, resources: ['ByteByteGo System Design'] }
        ]
      }
    ]
  },

  Cognizant: {
    name: 'Cognizant (CTS)',
    logo: '🔷',
    badge: 'Cognizant Hiring Funnel',
    stages: [
      {
        stage: 1,
        tier: 'GenC',
        package: '4.0 LPA',
        icon: Code2,
        color: 'text-blue-400',
        bg: 'bg-blue-500/15',
        border: 'border-blue-500/30',
        description: 'Analytical Aptitude & Core Programming',
        rounds: ['GenC Communication & Technical Test', 'Programming Logic', 'TR + HR Interview'],
        topics: [
          { id: 'cts_g1', label: 'Cognizant Quantitative & Logical Reasoning', done: true, resources: ['Indiabix', 'PrepInsta CTS'] },
          { id: 'cts_g2', label: 'C / Java / Python Syntax & Output Analysis', done: true, resources: ['GFG Programming Logic'] },
          { id: 'cts_g3', label: 'Basic SQL Commands (SELECT, WHERE, GROUP BY)', done: false, resources: ['W3Schools SQL'] }
        ]
      },
      {
        stage: 2,
        tier: 'GenC Elevate',
        package: '5.4 LPA',
        icon: Cpu,
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/15',
        border: 'border-cyan-500/30',
        description: 'Object-Oriented Programming & Intermediate Coding',
        rounds: ['Elevate Skill Assessment', 'Coding (2 medium problems)', 'Technical Deep Dive'],
        topics: [
          { id: 'cts_e1', label: 'Object-Oriented Design Principles (Inheritance, Polymorphism)', done: false, resources: ['Java Brains'] },
          { id: 'cts_e2', label: 'DSA: Stacks, Queues & Hashing', done: false, resources: ['LeetCode Medium'] },
          { id: 'cts_e3', label: 'Database Queries, Indexing & Transactions', done: false, resources: ['Neso Academy DBMS'] }
        ]
      },
      {
        stage: 3,
        tier: 'GenC Pro / Next',
        package: '6.75 - 10.0 LPA',
        icon: Layers,
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/15',
        border: 'border-indigo-500/30',
        description: 'Full-Stack Architecture & Cloud Enterprise Solutions',
        rounds: ['Domain Technical Hackathon', 'System Architecture Round', 'Director Discussion'],
        topics: [
          { id: 'cts_p1', label: 'Full-Stack Development (React + Spring Boot / Node)', done: false, resources: ['InterviewIQ Core Docs'] },
          { id: 'cts_p2', label: 'RESTful API Engineering & Security', done: false, resources: ['Spring Security JWT'] },
          { id: 'cts_p3', label: 'Microservices & Containerization (Docker, Kubernetes)', done: false, resources: ['Docker Docs'] }
        ]
      }
    ]
  },

  Amex: {
    name: 'American Express (Amex)',
    logo: '💳',
    badge: 'Amex Tech Pathway',
    stages: [
      {
        stage: 1,
        tier: 'Tech Associate Trainee',
        package: '8.0 - 12.0 LPA',
        icon: Code2,
        color: 'text-blue-400',
        bg: 'bg-blue-500/15',
        border: 'border-blue-500/30',
        description: 'Core CS Foundations & HackerRank Screening',
        rounds: ['HackerRank Online Coding (2 DSA Problems)', 'CS Fundamentals Assessment', 'Technical Interview 1'],
        topics: [
          { id: 'amex_t1', label: 'Arrays, Strings & Hash Tables (HackerRank Easy/Med)', done: true, resources: ['HackerRank DSA'] },
          { id: 'amex_t2', label: 'Object Oriented Programming & Design Patterns', done: true, resources: ['Refactoring Guru'] },
          { id: 'amex_t3', label: 'Operating Systems (Concurrency, Threads, Locks)', done: false, resources: ['Gate Smashers OS'] }
        ]
      },
      {
        stage: 2,
        tier: 'Software Engineer (L01)',
        package: '16.0 - 22.0 LPA',
        icon: Cpu,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/15',
        border: 'border-emerald-500/30',
        description: 'Advanced Data Structures & High-Level System Design',
        rounds: ['Algorithmic Round (Trees, Graphs, DP)', 'Low Level System Design (LLD)', 'Behavioral & Leadership Round'],
        topics: [
          { id: 'amex_e1', label: 'Tree & Graph Algorithms (Dijkstra, Topological Sort)', done: false, resources: ['NeetCode 150'] },
          { id: 'amex_e2', label: 'Dynamic Programming & Memoization', done: false, resources: ['Striver DP Sheet'] },
          { id: 'amex_e3', label: 'Low Level Design (Parking Lot, Elevator System)', done: false, resources: ['Shreyansh Jain LLD'] }
        ]
      },
      {
        stage: 3,
        tier: 'Senior Tech Lead',
        package: '28.0+ LPA',
        icon: Layers,
        color: 'text-amber-400',
        bg: 'bg-amber-500/15',
        border: 'border-amber-500/30',
        description: 'High-Concurrency Financial Systems & Distributed Cloud',
        rounds: ['Distributed Systems Architecture', 'High Throughput & Financial Security Design', 'Executive Round'],
        topics: [
          { id: 'amex_s1', label: 'Distributed Systems & Microservice Transactions', done: false, resources: ['ByteByteGo System Design'] },
          { id: 'amex_s2', label: 'High Availability & Fault Tolerance in Financial Systems', done: false, resources: ['Designing Data-Intensive Apps'] }
        ]
      }
    ]
  },

  HCLTech: {
    name: 'HCLTech',
    logo: '🔴',
    badge: 'HCL Placement Track',
    stages: [
      {
        stage: 1,
        tier: 'First Careers Trainee',
        package: '3.5 LPA',
        icon: Code2,
        color: 'text-rose-400',
        bg: 'bg-rose-500/15',
        border: 'border-rose-500/30',
        description: 'Technical Aptitude, Logical Reasoning & C/Java Basics',
        rounds: ['HCL Aptitude & Tech Test', 'Basic Coding Test', 'HR Interview'],
        topics: [
          { id: 'hcl_f1', label: 'HCL Numerical & Logical Aptitude', done: true, resources: ['PrepInsta HCL'] },
          { id: 'hcl_f2', label: 'Basics of C/C++/Java Syntax', done: true, resources: ['GFG Basics'] },
          { id: 'hcl_f3', label: 'Relational Database SQL Select Statements', done: false, resources: ['W3Schools SQL'] }
        ]
      },
      {
        stage: 2,
        tier: 'Graduate Engineer Trainee (GET)',
        package: '5.0 - 6.0 LPA',
        icon: Cpu,
        color: 'text-orange-400',
        bg: 'bg-orange-500/15',
        border: 'border-orange-500/30',
        description: 'Data Structures, Database Management & Web Technologies',
        rounds: ['GET Coding Assessment', 'Data Structures & SQL Round', 'Technical Interview'],
        topics: [
          { id: 'hcl_g1', label: 'Data Structures: Arrays, Linked Lists & Trees', done: false, resources: ['LeetCode Easy/Medium'] },
          { id: 'hcl_g2', label: 'Object Oriented Programming & Exception Handling', done: false, resources: ['Java Brains'] },
          { id: 'hcl_g3', label: 'REST API Concepts & HTTP Protocol', done: false, resources: ['InterviewIQ AI RAG'] }
        ]
      },
      {
        stage: 3,
        tier: 'Senior Technical Associate',
        package: '8.0+ LPA',
        icon: Layers,
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/15',
        border: 'border-indigo-500/30',
        description: 'Enterprise Full Stack & Cloud Native Development',
        rounds: ['Full Stack Hands-on Round', 'Cloud Architecture Round', 'Managerial Interview'],
        topics: [
          { id: 'hcl_s1', label: 'Spring Boot Microservices & JPA Hibernate', done: false, resources: ['Spring Docs'] },
          { id: 'hcl_s2', label: 'CI/CD Pipelines & Cloud Deployment', done: false, resources: ['Docker & AWS'] }
        ]
      }
    ]
  },

  Wipro: {
    name: 'Wipro',
    logo: '⭕',
    badge: 'Wipro Talent Ladder',
    stages: [
      {
        stage: 1,
        tier: 'Wipro Elite (NLTH)',
        package: '3.5 LPA',
        icon: Code2,
        color: 'text-green-400',
        bg: 'bg-green-500/15',
        border: 'border-green-500/30',
        description: 'Quants, Logical, Essay Writing & Basic Coding',
        rounds: ['Wipro NLTH Test (Aptitude + Essay)', 'Basic Coding (2 Problems)', 'Technical + HR Interview'],
        topics: [
          { id: 'wip_e1', label: 'Quants, Logical & Verbal Reasoning', done: true, resources: ['PrepInsta Wipro'] },
          { id: 'wip_e2', label: 'Written Communication & Essay Grammar', done: true, resources: ['Indiabix Essay'] },
          { id: 'wip_e3', label: 'Basic Array & String Manipulation', done: false, resources: ['LeetCode Easy'] }
        ]
      },
      {
        stage: 2,
        tier: 'Wipro Turbo',
        package: '6.5 LPA',
        icon: Cpu,
        color: 'text-teal-400',
        bg: 'bg-teal-500/15',
        border: 'border-teal-500/30',
        description: 'Advanced Data Structures & Technical Interview',
        rounds: ['Turbo Coding Challenge', 'Data Structures & OOP Round', 'Technical Interview'],
        topics: [
          { id: 'wip_t1', label: 'Stacks, Queues, Recursion & Binary Trees', done: false, resources: ['GeeksforGeeks'] },
          { id: 'wip_t2', label: 'DBMS Indexing & Complex SQL Queries', done: false, resources: ['LeetCode SQL'] }
        ]
      },
      {
        stage: 3,
        tier: 'Wipro Velocity',
        package: '9.5 LPA',
        icon: Layers,
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/15',
        border: 'border-cyan-500/30',
        description: 'High Performance Enterprise Systems & Cloud Solutions',
        rounds: ['Velocity Technical Challenge', 'System Architecture Discussion', 'Leadership Interview'],
        topics: [
          { id: 'wip_v1', label: 'System Design Fundamentals & Scalability', done: false, resources: ['ByteByteGo'] },
          { id: 'wip_v2', label: 'Cloud Native Microservices Architecture', done: false, resources: ['Spring AI Docs'] }
        ]
      }
    ]
  },

  Accenture: {
    name: 'Accenture',
    logo: '🟣',
    badge: 'Accenture Career Arc',
    stages: [
      {
        stage: 1,
        tier: 'Associate Software Engineer (ASE)',
        package: '4.5 LPA',
        icon: Code2,
        color: 'text-purple-400',
        bg: 'bg-purple-500/15',
        border: 'border-purple-500/30',
        description: 'Cognitive Assessment, Pseudocode & Communication',
        rounds: ['Cognitive & Technical Assessment', 'Pseudocode Test', 'Communication Assessment', 'HR Round'],
        topics: [
          { id: 'acc_a1', label: 'Accenture Cognitive & Analytical Aptitude', done: true, resources: ['PrepInsta Accenture'] },
          { id: 'acc_a2', label: 'Pseudocode & Programming Logic', done: true, resources: ['GFG Pseudocode'] },
          { id: 'acc_a3', label: 'Spoken English & Communication Assessment', done: true, resources: ['InterviewIQ Practice'] }
        ]
      },
      {
        stage: 2,
        tier: 'Advanced Associate Software Engineer (AASE)',
        package: '6.5 LPA',
        icon: Cpu,
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/15',
        border: 'border-indigo-500/30',
        description: 'Technical Coding Challenge & Core CS Principles',
        rounds: ['AASE Coding Assessment (2 Medium Problems)', 'Deep Technical Interview', 'Managerial Interview'],
        topics: [
          { id: 'acc_aa1', label: 'Data Structures (Arrays, Linked Lists, Trees)', done: false, resources: ['NeetCode 150'] },
          { id: 'acc_aa2', label: 'Database Management Systems & SQL', done: false, resources: ['Neso Academy DBMS'] },
          { id: 'acc_aa3', label: 'Web Technologies Basics (JavaScript, REST)', done: false, resources: ['InterviewIQ AI'] }
        ]
      },
      {
        stage: 3,
        tier: 'Custom Software Engineering Lead',
        package: '10.0+ LPA',
        icon: Layers,
        color: 'text-amber-400',
        bg: 'bg-amber-500/15',
        border: 'border-amber-500/30',
        description: 'Distributed Architecture, Cloud Operations & DevOps',
        rounds: ['System Architecture Hackathon', 'Cloud & Security Discussion', 'Leadership Round'],
        topics: [
          { id: 'acc_c1', label: 'Microservices Design & Security Patterns', done: false, resources: ['Spring Security'] },
          { id: 'acc_c2', label: 'Enterprise Cloud Architecture (AWS / Azure)', done: false, resources: ['Cloud Architecture'] }
        ]
      }
    ]
  },

  Capgemini: {
    name: 'Capgemini',
    logo: '🔵',
    badge: 'Capgemini Growth Path',
    stages: [
      {
        stage: 1,
        tier: 'Analyst',
        package: '4.0 LPA',
        icon: Code2,
        color: 'text-blue-400',
        bg: 'bg-blue-500/15',
        border: 'border-blue-500/30',
        description: 'Pseudocode, English Communication & Game-based Aptitude',
        rounds: ['Pseudocode Round', 'Game-based Aptitude Test', 'English Communication Test', 'HR Interview'],
        topics: [
          { id: 'cap_a1', label: 'Game-based Aptitude & Logical Puzzles', done: true, resources: ['PrepInsta Capgemini'] },
          { id: 'cap_a2', label: 'Pseudocode Execution & Bug Spotting', done: true, resources: ['GFG Pseudocode'] },
          { id: 'cap_a3', label: 'Communication & Behavioral Round', done: false, resources: ['InterviewIQ AI HR'] }
        ]
      },
      {
        stage: 2,
        tier: 'Senior Analyst / Differential Hire',
        package: '7.5 LPA',
        icon: Cpu,
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/15',
        border: 'border-cyan-500/30',
        description: 'Technical Coding, Object-Oriented Design & Databases',
        rounds: ['Differential Coding Challenge', 'Technical Data Structures Round', 'Technical Interview'],
        topics: [
          { id: 'cap_sa1', label: 'Data Structures (Arrays, Strings, Hashing)', done: false, resources: ['LeetCode Medium'] },
          { id: 'cap_sa2', label: 'Object Oriented Design & Clean Code Practices', done: false, resources: ['Refactoring Guru'] },
          { id: 'cap_sa3', label: 'SQL Joins, Views & Stored Procedures', done: false, resources: ['LeetCode SQL'] }
        ]
      },
      {
        stage: 3,
        tier: 'Consultant Software Engineer',
        package: '11.0+ LPA',
        icon: Layers,
        color: 'text-purple-400',
        bg: 'bg-purple-500/15',
        border: 'border-purple-500/30',
        description: 'Microservices Architecture, Cloud Operations & DevOps',
        rounds: ['System Design Discussion', 'Domain Architecture Round', 'Executive Interview'],
        topics: [
          { id: 'cap_c1', label: 'System Design & Scalable Web Architectures', done: false, resources: ['ByteByteGo'] },
          { id: 'cap_c2', label: 'Containerization & CI/CD Pipelines', done: false, resources: ['Docker & Kubernetes'] }
        ]
      }
    ]
  },

  TechMahindra: {
    name: 'Tech Mahindra',
    logo: '🔴',
    badge: 'Tech Mahindra Track',
    stages: [
      {
        stage: 1,
        tier: 'Associate Software Engineer',
        package: '3.25 - 4.0 LPA',
        icon: Code2,
        color: 'text-red-400',
        bg: 'bg-red-500/15',
        border: 'border-red-500/30',
        description: 'Aptitude, Psychometric Test & Technical Basics',
        rounds: ['Aptitude & Technical Screening', 'Psychometric Assessment', 'Technical + HR Interview'],
        topics: [
          { id: 'tm_a1', label: 'Quant, Logical & English Verbal Ability', done: true, resources: ['Indiabix'] },
          { id: 'tm_a2', label: 'C/C++/Java Language Basics & OOPs', done: true, resources: ['GeeksforGeeks'] },
          { id: 'tm_a3', label: 'Basic Relational Database & SQL', done: false, resources: ['W3Schools SQL'] }
        ]
      },
      {
        stage: 2,
        tier: 'Super Coder',
        package: '5.5 - 7.0 LPA',
        icon: Cpu,
        color: 'text-rose-400',
        bg: 'bg-rose-500/15',
        border: 'border-rose-500/30',
        description: 'Complex Algorithmic Coding, SQL/NoSQL & API Engineering',
        rounds: ['Super Coder Algorithmic Test', 'Deep Technical Data Structures Round'],
        topics: [
          { id: 'tm_sc1', label: 'Data Structures: Dynamic Arrays, Trees & Graphs', done: false, resources: ['NeetCode 150'] },
          { id: 'tm_sc2', label: 'REST API Engineering & JSON Processing', done: false, resources: ['Spring Boot Tutorials'] }
        ]
      },
      {
        stage: 3,
        tier: 'Digital Enterprise Specialist',
        package: '9.0+ LPA',
        icon: Layers,
        color: 'text-amber-400',
        bg: 'bg-amber-500/15',
        border: 'border-amber-500/30',
        description: 'System Scalability, Microservices & AI/ML Integration',
        rounds: ['Digital Architecture Challenge', 'Executive Leadership Round'],
        topics: [
          { id: 'tm_d1', label: 'High Scalability System Design', done: false, resources: ['System Design Primer'] },
          { id: 'tm_d2', label: 'AI/ML Model Deployment & Spring AI', done: false, resources: ['Spring AI Docs'] }
        ]
      }
    ]
  },

  Amazon: {
    name: 'Amazon',
    logo: '🟠',
    badge: 'Amazon SDE Career Ladder',
    stages: [
      {
        stage: 1,
        tier: 'SDE Intern / Support Engineer',
        package: '12.0 - 18.0 LPA',
        icon: Code2,
        color: 'text-orange-400',
        bg: 'bg-orange-500/15',
        border: 'border-orange-500/30',
        description: 'Online Assessment (2 Coding Questions + Work Style Survey)',
        rounds: ['Amazon Online Assessment (OA1 & OA2)', 'Technical Interview 1', 'Bar Raiser Discussion'],
        topics: [
          { id: 'amz_i1', label: 'Amazon OA Top Questions (Arrays, Hash Maps, Priority Queues)', done: true, resources: ['LeetCode Amazon Tagged'] },
          { id: 'amz_i2', label: 'Amazon 14 Leadership Principles (STAR Method Examples)', done: true, resources: ['Dan Croitor Leadership'] },
          { id: 'amz_i3', label: 'Time & Space Complexity Analysis', done: true, resources: ['Big-O CheatSheet'] }
        ]
      },
      {
        stage: 2,
        tier: 'SDE-I (Software Development Engineer 1)',
        package: '28.0 - 34.0 LPA',
        icon: Cpu,
        color: 'text-amber-400',
        bg: 'bg-amber-500/15',
        border: 'border-amber-500/30',
        description: 'DSA (Trees, Graphs, DP, Trie), Object-Oriented Design (OOD) & Leadership',
        rounds: ['OA Screening', 'Round 1: Problem Solving & DSA', 'Round 2: Object-Oriented Design (OOD)', 'Round 3: Bar Raiser + Leadership'],
        topics: [
          { id: 'amz_sde1_1', label: 'Trees, Graphs, BFS/DFS & Topo Sort', done: false, resources: ['NeetCode 150', 'Striver Sheet'] },
          { id: 'amz_sde1_2', label: 'Dynamic Programming & Backtracking', done: false, resources: ['Aditya Verma DP'] },
          { id: 'amz_sde1_3', label: 'Low-Level Object Oriented Design (Design Amazon Locker / Elevator)', done: false, resources: ['Shreyansh Jain LLD'] },
          { id: 'amz_sde1_4', label: 'Deep Dive Leadership Principle Stories (Customer Obsession, Ownership)', done: false, resources: ['InterviewIQ AI HR'] }
        ]
      },
      {
        stage: 3,
        tier: 'SDE-II / High Scale Engineer',
        package: '45.0+ LPA',
        icon: Layers,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/15',
        border: 'border-emerald-500/30',
        description: 'Distributed High-Scale System Design, Microservices & Architecture',
        rounds: ['High Level System Design (HLD)', 'Low Level System Design (LLD)', 'Algorithmic Optimization', 'Executive Bar Raiser'],
        topics: [
          { id: 'amz_sde2_1', label: 'High Level System Design (Design AWS S3 / Distributed Queue)', done: false, resources: ['ByteByteGo'] },
          { id: 'amz_sde2_2', label: 'Consistent Hashing, Microservices & Caching Strategies', done: false, resources: ['System Design Primer'] }
        ]
      }
    ]
  },

  Google: {
    name: 'Google',
    logo: '🔴',
    badge: 'Google Engineering Ladder',
    stages: [
      {
        stage: 1,
        tier: 'STEP Intern / Early Career',
        package: '15.0 - 22.0 LPA',
        icon: Code2,
        color: 'text-red-400',
        bg: 'bg-red-500/15',
        border: 'border-red-500/30',
        description: 'Online Coding Challenge & Core Data Structures',
        rounds: ['Google Online Challenge (GOC)', '2 Technical Coding Interviews', 'Googliness Round'],
        topics: [
          { id: 'goog_1', label: 'Google Online Challenge Problem Solving', done: true, resources: ['LeetCode Google Tagged'] },
          { id: 'goog_2', label: 'Data Structures: Trees, Tries, Disjoint Set Union (DSU)', done: true, resources: ['NeetCode 150'] },
          { id: 'goog_3', label: 'Googliness & Leadership Scenarios', done: false, resources: ['Google Values'] }
        ]
      },
      {
        stage: 2,
        tier: 'L3 Software Engineer',
        package: '32.0 - 40.0 LPA',
        icon: Cpu,
        color: 'text-blue-400',
        bg: 'bg-blue-500/15',
        border: 'border-blue-500/30',
        description: 'Advanced Data Structures, Graph Algorithms & Dynamic Programming',
        rounds: ['GOC Screening', '3 Technical Coding Rounds (Medium/Hard)', '1 Googliness & Leadership Round'],
        topics: [
          { id: 'goog_l3_1', label: 'Advanced Graph Algorithms (Tarjan, Shortest Paths)', done: false, resources: ['CP Handbook'] },
          { id: 'goog_l3_2', label: 'Complex DP & Binary Search on Answer', done: false, resources: ['Striver DP Series'] },
          { id: 'goog_l3_3', label: 'Optimal Code Cleanliness & Edge Case Handling', done: false, resources: ['InterviewIQ AI Technical'] }
        ]
      },
      {
        stage: 3,
        tier: 'L4 Software Engineer II',
        package: '50.0+ LPA',
        icon: Layers,
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/15',
        border: 'border-yellow-500/30',
        description: 'Scalable System Architecture, Concurrency & Algorithmic Optimization',
        rounds: ['System Design Round', '3 Coding Rounds (Hard)', 'Googliness Leadership Round'],
        topics: [
          { id: 'goog_l4_1', label: 'Distributed Scalable Infrastructure Design', done: false, resources: ['ByteByteGo'] },
          { id: 'goog_l4_2', label: 'Concurrency, Thread Safety & Memory Management', done: false, resources: ['Designing Data-Intensive Apps'] }
        ]
      }
    ]
  }
}

export default function Roadmap() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [selectedCompanyKey, setSelectedCompanyKey] = useState('TCS')
  const [checkedTopics, setCheckedTopics] = useState({})
  const [expandedStage, setExpandedStage] = useState(1)

  const currentPathway = COMPANY_PATHWAYS[selectedCompanyKey] || COMPANY_PATHWAYS.TCS

  const toggleTopic = (topicId) => {
    setCheckedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }))
  }

  // Calculate stats for current selected company pathway
  const totalTopics = currentPathway.stages.flatMap(s => s.topics).length
  const completedTopics = currentPathway.stages.flatMap(s => s.topics).filter(t => t.done || checkedTopics[t.id]).length
  const overallPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Building2 size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Company-Specific Career Progression Pathways</h1>
            <p className="text-sm text-slate-400">
              Step-by-step tier ladder from initial hiring roles to high-tier packages for top MNCs.
            </p>
          </div>
        </div>

        <button onClick={() => navigate('/student/practice')} className="btn-primary text-sm shrink-0 flex items-center gap-2">
          <Play size={14} /> Practice Company Mock
        </button>
      </div>

      {/* Target MNC Selection Grid */}
      <div className="surface-card p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-indigo-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Select Your Target MNC</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">11 Major MNC Pathways Supported</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {Object.keys(COMPANY_PATHWAYS).map((compKey) => {
            const comp = COMPANY_PATHWAYS[compKey]
            const isSelected = selectedCompanyKey === compKey
            return (
              <button
                key={compKey}
                onClick={() => {
                  setSelectedCompanyKey(compKey)
                  setExpandedStage(1)
                }}
                className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10 ring-2 ring-indigo-500/30'
                    : 'bg-white/4 border-white/8 text-slate-300 hover:bg-white/8 hover:border-white/20'
                }`}
              >
                <span className="text-lg">{comp.logo}</span>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold truncate">{compKey}</p>
                  <p className="text-[10px] text-slate-400 truncate">{comp.stages.length} Tiers</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected Company Banner + Overall Progress */}
      <div className="surface-card p-6 border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl p-2 bg-white/5 rounded-2xl border border-white/10">{currentPathway.logo}</div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-1">
                <Sparkles size={12} /> {currentPathway.badge}
              </div>
              <h2 className="text-2xl font-bold text-white">{currentPathway.name}</h2>
              <p className="text-xs text-slate-400 mt-1">
                Targeted preparation progression from Entry Tier → Professional Tier → Advanced Tier.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 shrink-0">
            <div>
              <p className="text-xs font-semibold text-slate-400">Path Readiness</p>
              <p className="text-2xl font-bold text-emerald-400">{overallPct}%</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <p className="text-xs font-semibold text-slate-400">Topics Done</p>
              <p className="text-2xl font-bold text-white">{completedTopics} / {totalTopics}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all duration-1000"
            style={{ width: `${overallPct}%`, background: 'linear-gradient(90deg, #6366f1, #a855f7, #10b981)' }}
          />
        </div>
      </div>

      {/* Step-by-Step Tier Stages */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Zap size={20} className="text-amber-400" /> Progression Ladder for {selectedCompanyKey}
        </h3>

        {currentPathway.stages.map((stageItem) => {
          const StageIcon = stageItem.icon || BookOpen
          const isOpen = expandedStage === stageItem.stage
          const stageDoneCount = stageItem.topics.filter(t => t.done || checkedTopics[t.id]).length
          const stageTotalCount = stageItem.topics.length
          const stagePct = stageTotalCount > 0 ? Math.round((stageDoneCount / stageTotalCount) * 100) : 0
          const isStageComplete = stageDoneCount === stageTotalCount

          return (
            <div
              key={stageItem.stage}
              className={`surface-card overflow-hidden border transition-all duration-200 ${
                isOpen ? stageItem.border || 'border-indigo-500/40' : 'border-white/8 hover:border-white/15'
              }`}
            >
              {/* Stage Header */}
              <button
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/3 transition-colors"
                onClick={() => setExpandedStage(isOpen ? null : stageItem.stage)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stageItem.bg}`}>
                    {isStageComplete
                      ? <Trophy size={26} className="text-amber-400 animate-bounce" />
                      : <StageIcon size={26} className={stageItem.color} />
                    }
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step {stageItem.stage}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                        {stageItem.package}
                      </span>
                      {isStageComplete && <span className="badge badge-green text-[10px]">Tier Cleared</span>}
                    </div>
                    <h4 className="text-xl font-bold text-white mt-1">{stageItem.tier}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{stageItem.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex flex-col items-end gap-1">
                    <span className="text-sm font-bold text-white">{stagePct}%</span>
                    <div className="w-28 bg-white/10 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${isStageComplete ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                        style={{ width: `${stagePct}%` }}
                      />
                    </div>
                  </div>
                  <ChevronRight
                    size={20}
                    className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                  />
                </div>
              </button>

              {/* Stage Body */}
              {isOpen && (
                <div className="border-t border-white/8 p-6 space-y-6 bg-white/2">
                  
                  {/* Exam Rounds Breakdown */}
                  <div>
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Hiring & Evaluation Rounds</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                      {stageItem.rounds.map((rnd, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/8 text-xs text-slate-200 flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold shrink-0 text-[10px]">
                            {idx + 1}
                          </div>
                          <span>{rnd}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Checklist Topics */}
                  <div>
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Preparation & Knowledge Checklist</h5>
                    <div className="space-y-2.5">
                      {stageItem.topics.map((topic) => {
                        const isDone = topic.done || checkedTopics[topic.id]
                        return (
                          <div
                            key={topic.id}
                            className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl transition-all gap-3 ${
                              isDone ? 'bg-emerald-500/8 border border-emerald-500/20' : 'bg-white/3 border border-white/5 hover:border-white/15'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => toggleTopic(topic.id)}
                                className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                  isDone
                                    ? 'bg-emerald-500 border-emerald-500 text-white'
                                    : 'border-white/30 hover:border-emerald-400'
                                }`}
                              >
                                {isDone && <CheckCircle2 size={12} />}
                              </button>
                              <span className={`text-sm font-medium ${isDone ? 'text-emerald-300 line-through' : 'text-slate-200'}`}>
                                {topic.label}
                              </span>
                            </div>

                            {topic.resources && topic.resources.length > 0 && (
                              <div className="flex items-center gap-1.5 sm:ml-auto">
                                {topic.resources.map((r, i) => (
                                  <span key={i} className="badge badge-blue text-[10px]">
                                    {r}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Action Bar for this Stage */}
                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      onClick={() => navigate('/student/practice')}
                      className="btn-primary text-xs py-2.5 px-4 flex items-center gap-2"
                    >
                      <Play size={14} /> Practice {stageItem.tier} AI Interview
                    </button>
                    <button
                      onClick={() => navigate('/student/skill-gap')}
                      className="btn-outline text-xs py-2.5 px-4 flex items-center gap-2"
                    >
                      <Target size={14} /> Skill Gap for {selectedCompanyKey}
                    </button>
                    <button
                      onClick={() => navigate('/student/doubts')}
                      className="btn-outline text-xs py-2.5 px-4 flex items-center gap-2"
                    >
                      <MessageSquare size={14} /> Ask Doubts via RAG AI
                    </button>
                  </div>

                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
