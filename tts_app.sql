-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 23 mai 2025 à 13:58
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `tts_app`
--

-- --------------------------------------------------------

--
-- Structure de la table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('g-V5AgZ12fmGAvjOXDUPCJbsJ11CB8uJ', 1748087780, '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2025-05-24T11:55:45.453Z\",\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":1}}');

-- --------------------------------------------------------

--
-- Structure de la table `tts_data`
--

CREATE TABLE `tts_data` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `text_content` text DEFAULT NULL,
  `audio_path` varchar(255) DEFAULT NULL,
  `voice_settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`voice_settings`)),
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `tts_data`
--

INSERT INTO `tts_data` (`id`, `user_id`, `title`, `text_content`, `audio_path`, `voice_settings`, `created_at`, `updated_at`) VALUES
(1, 1, 'jhrfidukhvrkfdhuib', 'jhrfidukhvrkfdhuib', 'a167dfa8-7847-4bd9-b7d6-d7fe6cbdcb80.mp3', '\"{\\\"type\\\":\\\"story\\\",\\\"language\\\":\\\"fr\\\",\\\"voice\\\":\\\"female1\\\",\\\"quality\\\":\\\"standard\\\"}\"', '2025-04-13 22:45:27', '2025-05-23 11:53:39'),
(2, 1, 'jhrfidukhvrkfdhuib', 'jhrfidukhvrkfdhuib', '7266eaab-6c1e-49f2-9226-90082d4d9435.mp3', '\"{\\\"type\\\":\\\"story\\\",\\\"language\\\":\\\"fr\\\",\\\"voice\\\":\\\"female1\\\",\\\"quality\\\":\\\"standard\\\"}\"', '2025-04-13 22:46:47', '2025-05-23 11:53:39'),
(3, 1, 'ghjyujnygy', 'ghjyujnygy\n', '100e0451-8787-43fd-b821-88d7e2601436.mp3', '\"{\\\"type\\\":\\\"story\\\",\\\"language\\\":\\\"fr\\\",\\\"voice\\\":\\\"female1\\\",\\\"quality\\\":\\\"standard\\\"}\"', '2025-04-13 23:08:06', '2025-05-23 11:53:39'),
(4, 9, 'bonjour', 'bonjour\n', '86439089-6ca2-42ae-b35b-11794a698fcd.mp3', '\"{\\\"type\\\":\\\"story\\\",\\\"language\\\":\\\"fr\\\",\\\"voice\\\":\\\"female1\\\",\\\"quality\\\":\\\"standard\\\"}\"', '2025-04-15 21:43:46', '2025-05-23 11:53:39'),
(5, 10, 'huerfjrdhfiuerdhufrugerjshdgdduerjhsgukrdthf', 'huerfjrdhfiuerdhufrugerjshdgdduerjhsgukrdthf', 'e4d7e7c6-e513-427a-ae20-77ae2f9d232d.mp3', '\"{\\\"type\\\":\\\"story\\\",\\\"language\\\":\\\"fr\\\",\\\"voice\\\":\\\"female1\\\",\\\"quality\\\":\\\"standard\\\"}\"', '2025-04-16 15:01:34', '2025-05-23 11:53:39'),
(6, 1, 'yugyujgyhguyjguyfbvythghyfyr', 'yugyujgyhguyjguyfbvythghyfyr', 'cacb2e1e-25be-45a3-a0e2-d4f70b9b008e.mp3', '\"{\\\"type\\\":\\\"story\\\",\\\"language\\\":\\\"fr\\\",\\\"voice\\\":\\\"female1\\\",\\\"quality\\\":\\\"standard\\\"}\"', '2025-04-25 13:04:55', '2025-05-23 11:53:39'),
(7, 1, 'hello', 'hello', 'audio_1_1747995627129.mp3', '{\"lang\":\"fr\"}', '2025-05-23 11:20:27', '2025-05-23 11:53:39'),
(8, 1, 'hhekugyukysferukyfds', 'hhekugyukysferukyfds', 'audio_1_1747995708465.mp3', '{\"lang\":\"fr\"}', '2025-05-23 11:21:48', '2025-05-23 11:53:39'),
(9, 1, 'hello', 'hello', 'audio_1_1747995797881.mp3', '{\"lang\":\"fr\"}', '2025-05-23 11:23:18', '2025-05-23 11:53:39'),
(10, 1, 'hello', 'hello', 'audio_1_1747997280619.mp3', '{\"lang\":\"fr\"}', '2025-05-23 11:48:01', '2025-05-23 11:53:39'),
(11, 1, 'hello', 'hello', 'audio_1_1747997308903.mp3', '{\"lang\":\"fr\"}', '2025-05-23 11:48:29', '2025-05-23 11:53:39'),
(12, 1, 'salam ana mohammmed', 'salam ana mohammmed', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1747997691200.mp3', '{\"lang\":\"fr\"}', '2025-05-23 11:54:51', '2025-05-23 11:54:51'),
(13, 1, '\n\n                                                ...', '\n\n                                                                        Exrecice 4 \n#include<stdio.h>  \n#include<math.h> \nfloat f(float x){ \n int m; \n return exp(x+cos(pow(x,2)+m)); \n} \nfloat g(float y){ \n int m; \n return exp(2+cos(pow(y,2)+m)); \n} \nint main(){ \n int n,m,i; \nfloat a,b,a1,b1,v=0,v1=0,h=0.5,s0=0,s1=0,somtotal=0; \nfloat x0,x1; \nprintf(\"donner le premier intervale:\"); \nscanf(\"%f%f\",&a,&b); \n \n printf(\"donner le 2eme intervale:\"); \nscanf(\"%f%f\",&a1,&b1); \n \n \n \nprintf(\"donner le nombre du sous intervalle:\"); \nscanf(\"%d\",&n); \nprintf(\"doner un nombre m:\"); \nscanf(\"%d\",&m); \n \nv=v+h*((f(a)*f(b))/2); \nv1=v1+h*((g(a1)*g(b1))/2); \nfor(i=0;i<n;i++){ \n\n x0=a+i*h; \n x1=a1+i*h; \n  s0=s0+h*f(x0); /*dans l\'intervale [1.2[*/ \n s1=s1+h*g(x1);    /*dans l\'intervale ]1.3]*/ \n} \nsomtotal=somtotal + (v+s0)+(v1+s1); \nprintf(\"In=%0.2f\",somtotal); \n \n} ', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1747997917426.mp3', '{\"lang\":\"fr\"}', '2025-05-23 11:59:24', '2025-05-23 11:59:24'),
(14, 1, 'mgjyfyjth', 'mgjyfyjth', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1747998052470.mp3', '{\"lang\":\"fr\"}', '2025-05-23 12:00:52', '2025-05-23 12:00:52'),
(15, 1, 'salam', 'salam', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1747999543131.mp3', '{\"lang\":\"fr\"}', '2025-05-23 12:25:43', '2025-05-23 12:25:43'),
(16, 1, 'gggggg', 'gggggg', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1747999701172.mp3', '{\"lang\":\"fr\"}', '2025-05-23 12:28:21', '2025-05-23 12:28:21'),
(17, 1, 'salam', 'salam', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1747999885336.mp3', '{\"lang\":\"fr\"}', '2025-05-23 12:31:26', '2025-05-23 12:31:26'),
(18, 1, 'salam', 'salam', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1747999895601.mp3', '{\"lang\":\"fr\"}', '2025-05-23 12:31:35', '2025-05-23 12:31:35'),
(19, 1, 'salam', 'salam', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1747999921354.mp3', '{\"lang\":\"en\"}', '2025-05-23 12:32:03', '2025-05-23 12:32:03'),
(20, 1, 'salam', 'salam', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1747999928074.mp3', '{\"lang\":\"en\"}', '2025-05-23 12:32:08', '2025-05-23 12:32:08'),
(21, 1, 'salam', 'salam', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1747999952240.mp3', '{\"lang\":\"fr\"}', '2025-05-23 12:32:33', '2025-05-23 12:32:33'),
(22, 1, 'salam', 'salam', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1747999955279.mp3', '{\"lang\":\"fr\"}', '2025-05-23 12:32:35', '2025-05-23 12:32:35'),
(23, 1, 'salam', 'salam', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1747999959070.mp3', '{\"lang\":\"fr\"}', '2025-05-23 12:32:39', '2025-05-23 12:32:39'),
(24, 1, 'salam', 'salam', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1747999960414.mp3', '{\"lang\":\"fr\"}', '2025-05-23 12:32:40', '2025-05-23 12:32:40'),
(25, 1, 'salam', 'salam', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1747999969365.mp3', '{\"lang\":\"fr\"}', '2025-05-23 12:32:49', '2025-05-23 12:32:49'),
(26, 1, 'salam', 'salam', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1747999975947.mp3', '{\"lang\":\"fr\"}', '2025-05-23 12:32:56', '2025-05-23 12:32:56'),
(27, 1, 'salam', 'salam', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1747999983389.mp3', '{\"lang\":\"en\"}', '2025-05-23 12:33:03', '2025-05-23 12:33:03'),
(28, 1, 'salam', 'salam', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1747999991203.mp3', '{\"lang\":\"en\"}', '2025-05-23 12:33:11', '2025-05-23 12:33:11'),
(29, 1, 'hhhhhhhh', 'hhhhhhhh', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1748000023942.mp3', '{\"lang\":\"en\"}', '2025-05-23 12:33:44', '2025-05-23 12:33:44'),
(30, 1, 'hhhhhhhh', 'hhhhhhhh', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1748000026658.mp3', '{\"lang\":\"en\"}', '2025-05-23 12:33:47', '2025-05-23 12:33:47'),
(31, 1, 'hhhhhhhh', 'hhhhhhhh', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1748000027907.mp3', '{\"lang\":\"en\"}', '2025-05-23 12:33:49', '2025-05-23 12:33:49'),
(32, 1, 'hhhhhhhh', 'hhhhhhhh', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1748000032767.mp3', '{\"lang\":\"en\"}', '2025-05-23 12:33:53', '2025-05-23 12:33:53'),
(33, 1, 'hhhhhhhh', 'hhhhhhhh', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1748000216868.mp3', '{\"lang\":\"fr\"}', '2025-05-23 12:36:57', '2025-05-23 12:36:57'),
(34, 1, 'hjjj', 'hjjj', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1748000234313.mp3', '{\"lang\":\"fr\"}', '2025-05-23 12:37:15', '2025-05-23 12:37:15'),
(35, 1, 'hjjj', 'hjjj', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1748000242941.mp3', '{\"lang\":\"en\"}', '2025-05-23 12:37:23', '2025-05-23 12:37:23'),
(36, 1, 'hjjj', 'hjjj', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1748000247290.mp3', '{\"lang\":\"en\"}', '2025-05-23 12:37:29', '2025-05-23 12:37:29'),
(37, 1, 'hhhhhhhhhhhhhhhh', 'hhhhhhhhhhhhhhhh', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1748000448824.mp3', '{\"lang\":\"fr\"}', '2025-05-23 12:40:49', '2025-05-23 12:40:49'),
(38, 1, 'hhhhhhhhhhhhhhhh', 'hhhhhhhhhhhhhhhh', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1748000457187.mp3', '{\"lang\":\"en\"}', '2025-05-23 12:40:57', '2025-05-23 12:40:57'),
(39, 1, 'hhhhhhhhhhhhhhhh', 'hhhhhhhhhhhhhhhh', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1748000462091.mp3', '{\"lang\":\"en\"}', '2025-05-23 12:41:02', '2025-05-23 12:41:02'),
(40, 1, 'hhhhhhhhhhhhhhhh', 'hhhhhhhhhhhhhhhh', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1748000467325.mp3', '{\"lang\":\"en\"}', '2025-05-23 12:41:07', '2025-05-23 12:41:07'),
(41, 1, 'salam ana mohamed', 'salam ana mohamed', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1748001368533.mp3', '{\"lang\":\"fr\"}', '2025-05-23 12:56:08', '2025-05-23 12:56:08'),
(42, 1, 'salam ana mohamed', 'salam ana mohamed', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1748001377038.mp3', '{\"lang\":\"en\"}', '2025-05-23 12:56:17', '2025-05-23 12:56:17'),
(43, 1, 'salam ana mohamed', 'salam ana mohamed', 'C:\\Users\\Lenovo\\Downloads\\project_TTS-master\\project_TTS-master\\backend\\audio\\audio_1_1748001379226.mp3', '{\"lang\":\"en\"}', '2025-05-23 12:56:19', '2025-05-23 12:56:19');

-- --------------------------------------------------------

--
-- Structure de la table `tts_history`
--

CREATE TABLE `tts_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `tts_data_id` int(11) NOT NULL,
  `played_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `tts_history`
--

INSERT INTO `tts_history` (`id`, `user_id`, `tts_data_id`, `played_at`) VALUES
(5, 1, 13, '2025-05-23 11:59:24'),
(6, 1, 14, '2025-05-23 12:00:52'),
(33, 1, 41, '2025-05-23 12:56:08'),
(34, 1, 42, '2025-05-23 12:56:17'),
(35, 1, 43, '2025-05-23 12:56:19');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `google_id` varchar(100) DEFAULT NULL,
  `facebook_id` varchar(100) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `google_id`, `facebook_id`, `created_at`, `updated_at`) VALUES
(1, 'abdo sarsif', 'abdosarsif28@gmail.com', NULL, '108662091894260021716', NULL, '2025-04-13 14:42:49', '2025-04-13 14:42:49'),
(2, 'Sersif Abdeljalil', 'sersifabdeljalil28@gmail.com', NULL, '103754437426647101010', NULL, '2025-04-13 14:48:06', '2025-04-13 14:48:06'),
(3, 'Abdo Abdo', 'aa0691366018@gmail.com', NULL, '110086040047076809953', NULL, '2025-04-13 14:50:04', '2025-04-13 14:50:04'),
(4, 'aymen', 'aa123@gmail.com', '$2b$10$Fheay4Il9nOCyNpYBl3PhuRoh5l8Lf0rImR3eYRQeYxcE.Fs579FC', NULL, NULL, '2025-04-13 18:09:57', '2025-04-13 18:09:57'),
(5, 'aa', 'bbb@gmail.com', '$2b$10$k3IlKXIyTIkCCW1SrKRlpusYr39pJ4BdPyFQ41QOnb2N8XSjI.b/u', NULL, NULL, '2025-04-13 18:29:16', '2025-04-13 18:29:16'),
(6, 'aa', 'abdo@gmaul.com', '$2b$10$8fQBzlrgAf47w6rQiWH/huBR8Zq8NcM3JwPTm9kP55yZKxtGd7.SG', NULL, NULL, '2025-04-13 19:22:39', '2025-04-13 19:22:39'),
(7, 'moha', 'sshejcgdwyu@gmail.com', '$2b$10$PzmLVY2HEhPicP/9jtLgZ.zR1q/osuQjBxr5CNQ1lsMUrGcR7x5q.', NULL, NULL, '2025-04-13 19:28:00', '2025-04-13 19:28:00'),
(8, 'star 8ball pool', 'asarsif3@gmail.com', NULL, '113937082810722656803', NULL, '2025-04-13 22:53:51', '2025-04-13 22:53:51'),
(9, 'med123', 'med123@gmail.com', '$2b$10$kKkz4Vwr/W2Q7a0sm3/NK.K.X7MG7XYJyN/sObx7bKgrBulOuljMa', NULL, NULL, '2025-04-15 21:43:11', '2025-04-15 21:43:11'),
(10, 'ayoub', 'aa1@gmail.com', '$2b$10$JxX00wlqoLexa5p9oljci.MwQeix.Qt72X3GFgDERcZ7mYcb3BNZi', NULL, NULL, '2025-04-16 15:00:01', '2025-04-16 15:00:01'),
(11, 'abdo', 'kk@gmail.com', '$2b$10$szetTaP4oSneq.aDFD.nIOW3/Mzy0ELyGNKXDiOsq0uqGk.oyEYTa', NULL, NULL, '2025-04-25 13:18:43', '2025-04-25 13:18:43');

-- --------------------------------------------------------

--
-- Structure de la table `user_settings`
--

CREATE TABLE `user_settings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `default_voice` varchar(50) DEFAULT NULL,
  `default_speed` float DEFAULT 1,
  `default_pitch` float DEFAULT 1,
  `theme` varchar(20) DEFAULT 'light',
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Index pour la table `tts_data`
--
ALTER TABLE `tts_data`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tts_data_user_id` (`user_id`);

--
-- Index pour la table `tts_history`
--
ALTER TABLE `tts_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tts_data_id` (`tts_data_id`),
  ADD KEY `idx_tts_history_user_id` (`user_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `google_id` (`google_id`),
  ADD UNIQUE KEY `facebook_id` (`facebook_id`),
  ADD KEY `idx_users_email` (`email`),
  ADD KEY `idx_users_google_id` (`google_id`),
  ADD KEY `idx_users_facebook_id` (`facebook_id`);

--
-- Index pour la table `user_settings`
--
ALTER TABLE `user_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `tts_data`
--
ALTER TABLE `tts_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT pour la table `tts_history`
--
ALTER TABLE `tts_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `user_settings`
--
ALTER TABLE `user_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `tts_data`
--
ALTER TABLE `tts_data`
  ADD CONSTRAINT `tts_data_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `tts_history`
--
ALTER TABLE `tts_history`
  ADD CONSTRAINT `tts_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tts_history_ibfk_2` FOREIGN KEY (`tts_data_id`) REFERENCES `tts_data` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `user_settings`
--
ALTER TABLE `user_settings`
  ADD CONSTRAINT `user_settings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
