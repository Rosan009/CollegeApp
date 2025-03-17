package com.collegeApp.Back_end.service;

import com.collegeApp.Back_end.model.TaskStatus;
import com.collegeApp.Back_end.repo.TaskStatusRepo;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.File;
import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Component
public class PdfScheduler {

    @Autowired
    private TaskStatusRepo taskRepository;

    @Scheduled(cron = "0 28 20 * * ?")
    public void generateAndSavePDF() {
        deleteOldPDFs();

        List<TaskStatus> tasks = taskRepository.findAll();
        String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());

        File directory = new File("src/main/resources/reports");
        if (!directory.exists()) {
            directory.mkdirs();
        }

        String filePath = "src/main/resources/reports/tasks_report_" + timestamp + ".pdf";

        try {
            Document document = new Document();
            PdfWriter.getInstance(document, new FileOutputStream(filePath));
            document.open();

            String currentDate = new SimpleDateFormat("yyyy-MM-dd").format(new Date());

            Font titleFont = new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD);
            Font contentFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL);

            Paragraph title = new Paragraph("Task Report - Date: " + currentDate + " - 4:30 PM\n\n", titleFont);
            document.add(title);

            for (TaskStatus task : tasks) {
                document.add(new Paragraph(
                        "Staff Name: " + task.getStaffName() + "\n" +
                                "Staff ID: " + task.getStaffId() + "\n" +
                                "Task Title: " + task.getTaskTitle() + "\n" +
                                "Description: " + task.getDescription() + "\n" +
                                "Status: " + task.getTaskStatus() + "\n\n",
                        contentFont
                ));
            }

            document.close();
            System.out.println("PDF generated successfully at: " + filePath);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void deleteOldPDFs() {
        File directory = new File("src/main/resources/reports");
        if (directory.exists()) {
            File[] files = directory.listFiles();
            if (files != null) {
                for (File file : files) {
                    if (file.getName().endsWith(".pdf") && isFileOlderThan12Hours(file)) {
                        boolean deleted = file.delete();
                        if (deleted) {
                            System.out.println("Deleted old file: " + file.getName());
                        } else {
                            System.out.println("Failed to delete file: " + file.getName());
                        }
                    }
                }
            }
        }
    }

    private boolean isFileOlderThan12Hours(File file) {
        long currentTime = System.currentTimeMillis();
        long fileTime = file.lastModified();
        return (currentTime - fileTime) > (12 * 60 * 60 * 1000); // 12 hours in milliseconds
    }

    @Scheduled(cron = "0 40 16 * * ?")
    public void clearTaskStatusData() {
        try {
            taskRepository.deleteAll();
            System.out.println("Task status data cleared after 4:40 PM.");
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Failed to clear task status data.");
        }
    }
}
